// Pruebas de los casos de «Mi trabajo»: reglas del modelo, archivos reales y contraste del texto secundario.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { casos, pestanas } from '../src/data/casos.ts';
import { validar, capturas } from '../src/lib/casos.js';
import { medidas } from '../src/lib/medidas.js';
import { contraste } from '../src/lib/collage.js';

const ASSETS = new URL('../src/assets/work/', import.meta.url).pathname;

test('los casos cumplen el modelo de datos', () => {
  const { errores } = validar(casos, pestanas);
  assert.deepEqual(errores, []);
});

test('cada captura existe y sus medidas coinciden con el archivo', () => {
  for (const c of casos) {
    for (const [donde, s] of capturas(c)) {
      if (!s.src) continue; // pendiente: lo reporta el build
      const ruta = ASSETS + s.src;
      assert.ok(existsSync(ruta), `${c.slug} · ${donde}: no existe ${s.src}`);
      const m = medidas(ruta);
      assert.deepEqual({ width: s.width, height: s.height }, m, `${c.slug} · ${donde}: medidas de ${s.src}`);
    }
  }
});

test('tres pestañas por rol y todos los casos alcanzables desde una pestaña', () => {
  assert.equal(pestanas.length, 3);
  const enPestana = pestanas.flatMap((t) => t.casos);
  for (const c of casos) assert.ok(enPestana.includes(c.slug), `${c.slug} no está en ninguna pestaña`);
});

test('el texto secundario cumple 4.5:1 sobre el fondo en ambos temas', () => {
  const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
  const valor = (re) => css.match(re)?.[1];
  const oscuro = { fondo: valor(/--p-0:\s*(#[0-9a-f]{6})/i), suave: valor(/--p-muted:\s*(#[0-9a-f]{6})/i) };
  const claro = { fondo: valor(/--c-fondo:\s*(#[0-9a-f]{6})/i), suave: valor(/--c-texto-suave:\s*(#[0-9a-f]{6})/i) };
  for (const [tema, t] of Object.entries({ oscuro, claro })) {
    assert.ok(t.fondo && t.suave, `${tema}: no se encontraron los tokens`);
    assert.ok(contraste(t.suave, t.fondo) >= 4.5, `${tema}: ${contraste(t.suave, t.fondo).toFixed(2)}:1`);
  }
});
