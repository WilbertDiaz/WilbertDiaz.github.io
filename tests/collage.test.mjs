// Pruebas del asignador de estilos del collage (botones.md, Regla 2 y criterios 1–3).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import tokens from '../src/data/hero-collage.tokens.json' with { type: 'json' };
import { asignar, grafemas, contraste, luminancia, fondoDe, REDONDOS, contarRecortes } from '../src/lib/collage.js';

const PALABRAS = [
  'user', 'stakeholder', 'client', 'partner', 'a', 'product owner', 'équipe', 'UX',
  'persona involucrada', 'usuario', 'cliente', 'socio', 'Ocho', 'gogogogogo', 'abcdefghijklmnopqrstuvwxy',
];
const TEMAS = ['dark', 'light'];
const recortes = (w, tema, semilla = '') => asignar(w, tema, tokens, semilla).filter((x) => !x.hueco);

test('todo par fg/bg del catálogo cumple 4.5:1', () => {
  for (const tema of TEMAS) {
    for (const p of tokens.scrapPapers[tema]) {
      const c = contraste(p.fg, fondoDe(p, tokens.theme[tema].bg));
      assert.ok(c >= 4.5, `${tema}/${p.id}: ${c.toFixed(2)}:1`);
    }
  }
});

test('segmenta por grafemas: acentos y emojis compuestos no se rompen', () => {
  assert.equal(grafemas('équipe').length, 6);
  assert.equal(grafemas('👩‍💻a').length, 2);
});

test('los espacios son huecos sin papel', () => {
  const items = asignar('product owner', 'dark', tokens);
  const huecos = items.filter((x) => x.hueco);
  assert.equal(huecos.length, 1);
  assert.equal(huecos[0].papel, undefined);
  assert.equal(contarRecortes(items), 12);
});

test('es determinista y la semilla cambia el collage', () => {
  for (const tema of TEMAS) {
    for (const w of PALABRAS) {
      assert.deepEqual(asignar(w, tema, tokens), asignar(w, tema, tokens), w);
    }
  }
  const firma = (s) => recortes('stakeholder', 'dark', s).map((x) => x.papel.id + x.tipo.id + x.rot).join();
  assert.notEqual(firma('a'), firma('b'));
});

for (const tema of TEMAS) {
  for (const w of PALABRAS) {
    test(`reglas de estilo · ${tema} · "${w}"`, () => {
      const r = recortes(w, tema);
      const n = r.length;
      const { min, max } = tokens.scrapGeometry.rotationDeg;
      for (let i = 1; i < n; i++) {
        assert.notEqual(r[i].papel.id, r[i - 1].papel.id, 'papeles gemelos seguidos');
        assert.notEqual(r[i].tipo.family, r[i - 1].tipo.family, 'familias gemelas seguidas');
        assert.ok(!(r[i].papel.kind === 'outline' && r[i - 1].papel.kind === 'outline'), 'contornos seguidos');
        assert.notEqual(Math.sign(r[i].rot), Math.sign(r[i - 1].rot), 'el signo de la rotación no alterna');
      }
      for (const x of r) {
        const m = Math.abs(x.rot);
        assert.ok(m >= min - 0.01 && m <= max + 0.01, `rotación fuera de rango: ${x.rot}`);
      }
      const acentos = r.filter((x) => x.papel.kind === 'accent');
      assert.ok(acentos.length <= 1, 'más de un acento');
      if (n < 4) assert.equal(acentos.length, 0, 'acento en palabra de menos de 4 recortes');
      if (tema === 'dark') for (const a of acentos) assert.ok(luminancia(a.papel.bg) < 0.2, 'en oscuro el acento solo va como texto');
      if (tema === 'light') for (const x of r) assert.ok(x.papel.bg === 'transparent' || luminancia(x.papel.bg) >= 0.2, 'fondo oscuro en claro');
      assert.ok(r.filter((x) => x.papel.kind === 'outline').length <= Math.floor(n * 0.25), 'demasiados contornos');
      const redondos = r.filter((x) => x.redondo);
      assert.ok(redondos.length <= 1, 'más de un redondo');
      for (const x of redondos) {
        assert.ok(REDONDOS.has(x.ch), `redondo en grafema no permitido: ${x.ch}`);
        assert.notEqual(x.i, 0, 'redondo en el primer recorte');
      }
      const monos = r.filter((x) => x.tipo.family === 'mono').map((x) => x.i);
      for (let i = 1; i < monos.length; i++) assert.ok(monos[i] - monos[i - 1] >= 3, 'mono más seguido que cada 3');
      if (n >= 3) assert.ok(new Set(r.map((x) => x.tipo.family)).size >= 2, 'menos de 2 familias');
      // Ancla de legibilidad en los primeros min(3, n)
      const solidos = tokens.scrapPapers[tema].filter((p) => p.kind === 'solid');
      const mejor = Math.max(...solidos.map((p) => contraste(p.fg, p.bg)));
      assert.ok(r.slice(0, Math.min(3, n)).some((x) => x.papel.kind === 'solid' && contraste(x.papel.fg, x.papel.bg) === mejor), 'falta el ancla');
    });
  }
}
