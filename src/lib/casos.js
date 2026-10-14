// Validación de los casos de «Mi trabajo». Sin DOM: la usan Trabajo.astro y las pruebas.
const LIMITES = { headline: 60, lead: 140, intro: 180, title: 40, why: 180 };
const IDIOMAS = ['en', 'es'];

/** Todas las capturas de un caso, con su ruta para los mensajes. */
export function capturas(caso) {
  const lista = [];
  if (caso.hero) lista.push(['hero', caso.hero]);
  caso.plates.forEach((p, i) => {
    if (p.type === 'full') lista.push([`plates[${i}].shot`, p.shot]);
    if (p.type === 'phones') p.items.forEach((it, k) => lista.push([`plates[${i}].items[${k}]`, it.shot]));
    if (p.type === 'duo') p.shots.forEach((sh, k) => lista.push([`plates[${i}].shots[${k}]`, sh]));
  });
  return lista;
}

const completa = (p) => capturas({ plates: [p] }).every(([, s]) => s.src);
/** Lo que se publica en producción: sin las láminas pendientes; null si el caso queda sin hero o con menos de 2 láminas. */
export function publicable(caso) {
  const plates = caso.plates.filter(completa);
  if ((caso.hero && !caso.hero.src) || plates.length < 2) return null;
  return { ...caso, plates };
}

/** Devuelve { errores, avisos }. Los errores rompen el build; los avisos marcan capturas pendientes. */
export function validar(casos, pestanas = []) {
  const errores = [];
  const avisos = [];
  const slugs = new Set();
  const texto = (ref, campo, valor, max) => {
    for (const l of IDIOMAS) {
      const v = valor?.[l];
      if (!v || !v.trim()) errores.push(`${ref}: falta ${campo}.${l}`);
      else if (max && v.length > max) errores.push(`${ref}: ${campo}.${l} pasa de ${max} caracteres (${v.length})`);
    }
  };
  for (const c of casos) {
    const ref = c.slug || '(sin slug)';
    if (!/^[a-z0-9-]+$/.test(c.slug ?? '')) errores.push(`${ref}: slug inválido`);
    if (slugs.has(c.slug)) errores.push(`${ref}: slug repetido`);
    slugs.add(c.slug);
    if (!c.name) errores.push(`${ref}: falta name`);
    else if (typeof c.name !== 'string') texto(ref, 'name', c.name, LIMITES.headline);
    texto(ref, 'headline', c.headline, LIMITES.headline);
    texto(ref, 'lead', c.lead, LIMITES.lead);
    texto(ref, 'intro', c.intro, LIMITES.intro);
    if (!Array.isArray(c.hice) || c.hice.length < 3 || c.hice.length > 8) errores.push(`${ref}: «hice» lleva de 3 a 8 viñetas`);
    (c.hice ?? []).forEach((h, k) => texto(`${ref} · hice[${k}]`, 'texto', h, 200));
    if (c.url && !/^https:\/\/[^\s/]+\.[^\s]+$/.test(c.url)) errores.push(`${ref}: url debe ser https://dominio`);
    if (c.hero && c.hero.device === 'photo') errores.push(`${ref}: hero debe ser desktop (o phone en un producto solo móvil)`);
    if (!Array.isArray(c.plates) || c.plates.length < 2 || c.plates.length > 5) errores.push(`${ref}: necesita de 2 a 5 láminas`);
    (c.plates ?? []).forEach((p, i) => {
      const r = `${ref} · plates[${i}]`;
      texto(r, 'title', p.title, LIMITES.title);
      texto(r, 'why', p.why, LIMITES.why);
      if (p.type === 'full' && p.shot.device !== 'desktop') errores.push(`${r}: full lleva desktop`);
      if (p.type === 'phones') {
        if (p.items.length < 2 || p.items.length > 3) errores.push(`${r}: phones lleva 2 o 3 capturas`);
        const tipos = new Set(p.items.map((it) => it.shot.device));
        if ([...tipos].some((d) => d === 'desktop') || tipos.size > 1) errores.push(`${r}: phones lleva solo phone (o solo photo)`);
        p.items.forEach((it, k) => texto(`${r}.items[${k}]`, 'label', it.label, LIMITES.title));
      }
      if (p.type === 'duo' && (p.shots?.length !== 2 || p.shots.some((sh) => sh.device !== 'desktop'))) errores.push(`${r}: duo lleva 2 capturas desktop`);
      if (!['full', 'phones', 'duo'].includes(p.type)) errores.push(`${r}: tipo de lámina desconocido`);
    });
    for (const [donde, s] of capturas(c)) {
      const r = `${ref} · ${donde}`;
      if (!(s.width > 0 && s.height > 0)) errores.push(`${r}: width y height deben ser mayores que 0`);
      texto(r, 'alt', s.alt);
      if (!s.src) avisos.push(`${r}: captura pendiente`);
    }
  }
  // Pestañas: cada caso que aparece en una pestaña existe, tiene hero y está en una sola
  const vistos = new Set();
  for (const t of pestanas) {
    texto(`pestaña ${t.id}`, 'label', t.label);
    if (!t.casos?.length) errores.push(`pestaña ${t.id}: sin casos`);
    for (const slug of t.casos ?? []) {
      const c = casos.find((x) => x.slug === slug);
      if (!c) errores.push(`pestaña ${t.id}: no existe el caso ${slug}`);
      else if (!c.hero) errores.push(`pestaña ${t.id}: ${slug} necesita hero`);
      if (vistos.has(slug)) errores.push(`pestaña ${t.id}: ${slug} aparece en dos pestañas`);
      vistos.add(slug);
    }
  }
  return { errores, avisos };
}
