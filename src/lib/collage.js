// Collage de la palabra rotativa del hero: asignación determinista de papel, tipografía y geometría.
// Sin DOM: lo usan el render del servidor (Hero.astro), el script del navegador y las pruebas.
// Las reglas numeradas corresponden a botones.md (Regla 1 a 3).

/** Grafemas con forma redonda: los únicos que admiten el recorte circular (Regla 2.5). */
export const REDONDOS = new Set(['o', 'a', 'e', 'c', 'd', 'b', 'p', 'q', 'g', '0', 'ó', 'á', 'é', 'O', 'C', 'D', 'Q', 'G']);

/** Regla 1: segmentación por grafemas para no romper acentos ni emojis compuestos. */
export function grafemas(texto) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(texto)].map((s) => s.segment);
  }
  return Array.from(texto);
}

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rgb = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

export function luminancia(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Fondo real de un papel: los contornos son transparentes y dejan ver el fondo del tema. */
export const fondoDe = (papel, fondoTema) => (papel.bg === 'transparent' ? fondoTema : papel.bg);

const esOscuro = (papel) => papel.bg !== 'transparent' && luminancia(papel.bg) < 0.2;

/**
 * Regla 2 y 3: devuelve un elemento por grafema.
 * Los espacios son huecos ({ hueco: true }); los demás, recortes con papel, tipografía, rotación y forma.
 */
export function asignar(palabra, tema, tokens, semilla = '') {
  const papeles = tokens.scrapPapers[tema];
  const tipos = tokens.scrapType;
  const fondoTema = tokens.theme[tema].bg;
  const rand = mulberry32(fnv1a(`${semilla}|${palabra}|${tema}`));
  const g = grafemas(palabra);
  const n = g.filter((c) => c.trim() !== '').length;

  // Ancla de legibilidad: el sólido con mayor contraste del catálogo, en alguno de los primeros min(3, n)
  const solidos = papeles.filter((p) => p.kind === 'solid' && !(tema === 'light' && esOscuro(p)));
  const mejor = Math.max(...solidos.map((p) => contraste(p.fg, p.bg)));
  const anclas = new Set(solidos.filter((p) => contraste(p.fg, p.bg) === mejor).map((p) => p.id));
  const posAncla = Math.floor(rand() * Math.min(3, n));
  const maxContornos = Math.floor(n * 0.25);
  const { min, max } = tokens.scrapGeometry.rotationDeg;
  let signo = rand() < 0.5 ? 1 : -1;

  const salida = [];
  let k = 0;
  let previo = null;
  let acentos = 0;
  let contornos = 0;
  let redondos = 0;
  let ultimoMono = -Infinity;
  let anclaUsada = false;

  for (const ch of g) {
    if (ch.trim() === '') {
      salida.push({ hueco: true, ch });
      continue;
    }
    const candidatos = (relajar) => {
      const lista = [];
      for (const p of papeles) {
        // 7. Modo claro sin negro (nunca se relaja)
        if (tema === 'light' && esOscuro(p)) continue;
        // 2. Acento escaso; en oscuro solo como color de texto sobre papel oscuro (nunca se relaja)
        if (p.kind === 'accent') {
          if (acentos >= 1 || n < 4) continue;
          if (tema === 'dark' && !esOscuro(p)) continue;
        }
        // 1. Sin papeles gemelos seguidos (esta parte no se relaja)
        if (previo && p.id === previo.papel.id) continue;
        // 3. Contornos limitados y nunca dos seguidos
        if (!relajar.contornos && p.kind === 'outline' && (contornos >= maxContornos || previo?.papel.kind === 'outline')) continue;
        // 4. Ancla de legibilidad
        if (k === posAncla && !anclaUsada && !anclas.has(p.id)) continue;
        for (const t of tipos) {
          // 1. Sin familias gemelas seguidas
          if (!relajar.familia && previo && t.family === previo.tipo.family) continue;
          // 6. Mono como máximo cada 3 recortes
          if (!relajar.tipos && t.family === 'mono' && k - ultimoMono < 3) continue;
          lista.push({ papel: p, tipo: t });
        }
      }
      return lista;
    };
    let c = candidatos({});
    if (!c.length) c = candidatos({ tipos: true });
    if (!c.length) c = candidatos({ tipos: true, contornos: true });
    if (!c.length) c = candidatos({ tipos: true, contornos: true, familia: true });
    const { papel, tipo } = c[Math.floor(rand() * c.length)];

    // 5. Forma redonda: solo grafemas redondos, uno por palabra, nunca el primero
    const redondo = k > 0 && redondos === 0 && REDONDOS.has(ch) && rand() < 0.4;
    // Regla 3: magnitud con la semilla y signo alterno
    const rot = signo * (min + rand() * (max - min));
    signo = -signo;

    if (papel.kind === 'accent') acentos++;
    if (papel.kind === 'outline') contornos++;
    if (redondo) redondos++;
    if (tipo.family === 'mono') ultimoMono = k;
    if (anclas.has(papel.id)) anclaUsada = true;

    const item = { ch, i: k, papel, tipo, rot: Math.round(rot * 100) / 100, redondo, fondoTema };
    salida.push(item);
    previo = item;
    k++;
  }
  return salida;
}

const FAMILIAS = { display: 'var(--f-display)', sans: 'var(--f-texto)', mono: 'var(--hc-mono)' };

/** Estilo en línea de un recorte. Lo comparten el servidor y el navegador para que el collage sea idéntico. */
export function estiloRecorte(item, tokens, n) {
  const m = tokens.motion;
  const escalon = Math.min(m.letterStaggerMs, m.maxTotalStaggerMs / Math.max(1, n - 1));
  const p = item.papel;
  const t = item.tipo;
  return [
    `--r:${item.rot}deg`,
    `--d-in:${Math.round(item.i * escalon)}ms`,
    `--d-jit:${item.i * m.jitter.phaseOffsetMs}ms`,
    `background:${p.bg}`,
    `color:${p.fg}`,
    `border:${p.border ?? '0'}`,
    `font-family:${FAMILIAS[t.family]}`,
    `font-weight:${item.redondo ? 900 : t.weight}`,
    `font-style:${t.italic ? 'italic' : 'normal'}`,
    `font-size:${t.scale}em`,
  ].join(';');
}

export const claseRecorte = (item) =>
  ['hc-scrap', item.papel.kind === 'outline' ? 'hc-outline' : '', item.redondo ? 'hc-round' : ''].filter(Boolean).join(' ');

export const contarRecortes = (items) => items.filter((x) => !x.hueco).length;
