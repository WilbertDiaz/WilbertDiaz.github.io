// Cambiar de idioma conserva el lugar: se guarda la sección en pantalla, cuánto se avanzó dentro de ella
// y la pestaña abierta de «Mi trabajo» (en la URL); la otra página lo restaura al cargar.
const CLAVE = 'pos-idioma';
const secciones = () => [...document.querySelectorAll('main section[id]')];
const inicio = (el) => el.getBoundingClientRect().top + scrollY;

document.querySelectorAll('.idioma a[lang], .menu-movil a[lang]').forEach((a) => {
  a.addEventListener('click', () => {
    // La pestaña de «Mi trabajo» viaja en la URL (?work=); el caso abierto no, porque el modal tapa el selector
    const destino = new URL(a.getAttribute('href'), location.origin);
    const work = new URL(location.href).searchParams.get('work');
    if (work) destino.searchParams.set('work', work);
    a.href = destino.pathname + destino.search;
    let actual = secciones()[0];
    for (const s of secciones()) if (inicio(s) <= scrollY + 2) actual = s;
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify({ id: actual?.id, dentro: actual ? scrollY - inicio(actual) : scrollY }));
    } catch {}
  });
});

let guardado = null;
try {
  guardado = JSON.parse(sessionStorage.getItem(CLAVE) ?? 'null');
  sessionStorage.removeItem(CLAVE);
} catch {}
const restaurar = () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const ir = () => {
    const s = guardado.id && document.getElementById(guardado.id);
    const y = s ? inicio(s) + guardado.dentro : guardado.dentro;
    window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
  };
  ir();
  document.fonts?.ready.then(ir);
}
if (guardado) {
  restaurar();
  if (document.readyState !== 'complete') addEventListener('load', restaurar, { once: true });
}
