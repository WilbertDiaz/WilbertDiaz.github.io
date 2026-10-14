// Palabra rotativa en collage: rota la lista, vuelve a montar cada palabra para reiniciar su entrada
// y desliza el ancho del hueco para que el resto del renglón no brinque (botones.md, Reglas 4 a 6).
import tokens from '../data/hero-collage.tokens.json';
import { asignar, estiloRecorte, claseRecorte, contarRecortes } from '../lib/collage.js';

const temaActual = () => (document.documentElement.dataset.tema === 'claro' ? 'light' : 'dark');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function construir(palabra, tema, semilla, animar) {
  const items = asignar(palabra, tema, tokens, semilla);
  const n = contarRecortes(items);
  const caja = document.createElement('span');
  caja.className = animar === 'quieto' ? 'hc-word hc-quieto' : animar ? 'hc-word hc-animado' : 'hc-word';
  caja.setAttribute('aria-hidden', 'true');
  for (const x of items) {
    const el = document.createElement('span');
    if (x.hueco) el.className = 'hc-gap';
    else {
      el.className = claseRecorte(x);
      el.style.cssText = estiloRecorte(x, tokens, n);
      el.textContent = x.ch;
    }
    caja.appendChild(el);
  }
  return caja;
}

for (const slot of document.querySelectorAll('[data-collage]')) {
  const palabras = JSON.parse(slot.dataset.words || '[]');
  if (!palabras.length) continue;
  const primary = slot.dataset.primary || palabras[0];
  const ciclo = Number(slot.dataset.cycle) || tokens.motion.cycleMs;
  const semilla = slot.dataset.seed || '';
  const h1 = slot.closest('h1') ?? slot.parentElement;
  slot.querySelectorAll('.hc-static').forEach((e) => e.remove());

  let idx = Math.max(0, palabras.indexOf(primary));
  let actual = null;
  const mostrar = (animar) => {
    const nueva = construir(palabras[idx], temaActual(), semilla, animar);
    if (actual) actual.replaceWith(nueva);
    else slot.appendChild(nueva);
    actual = nueva;
    if (anchos[palabras[idx]]) slot.style.width = `${anchos[palabras[idx]]}px`;
  };

  // Medidor oculto con los mismos recortes, papeles y fuentes. Se usa el ancho de layout exacto (con decimales)
  // redondeado hacia arriba: offsetWidth redondea hacia abajo y deja el hueco unas décimas más angosto que la palabra.
  const medidor = document.createElement('span');
  medidor.className = 'hc-medidor';
  medidor.setAttribute('aria-hidden', 'true');
  h1.appendChild(medidor);
  let anchos = {};
  const medir = () => {
    if (reduce) return;
    const tema = temaActual();
    anchos = {};
    for (const w of new Set(palabras)) {
      medidor.replaceChildren(construir(w, tema, semilla, false));
      anchos[w] = Math.ceil(medidor.getBoundingClientRect().width) + 1;
    }
    // ¿Cabe la palabra más larga junto a su cola? Se decide una vez por medida, no por palabra: así no hay saltos
    const cola = h1.querySelector('.hc-cola');
    if (cola) {
      medidor.textContent = cola.textContent;
      const anchoCola = Math.ceil(medidor.getBoundingClientRect().width);
      const mayor = Math.max(...Object.values(anchos));
      h1.classList.toggle('hc-partido', mayor + anchoCola > h1.clientWidth);
    }
    medidor.replaceChildren();
    if (anchos[palabras[idx]]) slot.style.width = `${anchos[palabras[idx]]}px`;
  };

  if (palabras.length === 1) {
    // Una sola palabra: collage quieto que solo tiembla; no hay nada que rotar
    const modo = reduce ? false : 'quieto';
    mostrar(modo);
    new MutationObserver(() => mostrar(modo)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });
    continue;
  }

  if (reduce) {
    // Collage estático de `primary`, sin entrada, sin temblor y sin transición de ancho
    mostrar(false);
    new MutationObserver(() => mostrar(false)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });
    continue;
  }

  let timer = 0;
  let corriendo = false;
  let enPantalla = true;
  const programar = () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      idx = (idx + 1) % palabras.length;
      mostrar(true);
      programar();
    }, ciclo);
  };
  const reanudar = () => {
    if (corriendo || document.hidden || !enPantalla) return;
    corriendo = true;
    mostrar(true); // retoma la palabra actual desde su entrada; no se salta ninguna
    programar();
  };
  const pausar = () => {
    corriendo = false;
    clearTimeout(timer);
  };

  medir();
  mostrar(false); // visible de inmediato aunque la pestaña cargue oculta
  reanudar();
  document.fonts?.ready.then(medir);
  let rz = 0;
  new ResizeObserver(() => { clearTimeout(rz); rz = window.setTimeout(medir, 120); }).observe(h1);
  new MutationObserver(() => { medir(); mostrar(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });
  document.addEventListener('visibilitychange', () => (document.hidden ? pausar() : reanudar()));
  new IntersectionObserver(([e]) => {
    enPantalla = e.isIntersecting;
    if (enPantalla) reanudar();
    else pausar();
  }).observe(slot.closest('section') ?? slot);
}
