// Scroll suave con la rueda del ratón: interpola hacia el destino en lugar de saltar.
// El teclado, la barra de scroll y las pantallas táctiles conservan el scroll nativo.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (matchMedia('(pointer: coarse)').matches) return;
  let objetivo = scrollY;
  let actual = scrollY;
  let raf = 0;
  const max = () => document.documentElement.scrollHeight - innerHeight;
  const paso = () => {
    actual += (objetivo - actual) * 0.12;
    if (Math.abs(objetivo - actual) < 0.5) actual = objetivo;
    window.scrollTo({ top: actual, behavior: 'instant' });
    raf = actual === objetivo ? 0 : requestAnimationFrame(paso);
  };
  addEventListener('wheel', (e) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // zoom o desplazamiento lateral
    if (document.querySelector('dialog[open]')) return; // un modal abierto conserva su scroll nativo
    e.preventDefault();
    const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    if (!raf) actual = objetivo = scrollY;
    objetivo = Math.max(0, Math.min(max(), objetivo + d));
    if (!raf) raf = requestAnimationFrame(paso);
  }, { passive: false });
  // Si el scroll cambia por otra vía (teclado, anclas, barra), el destino se sincroniza
  addEventListener('scroll', () => { if (!raf) actual = objetivo = scrollY; }, { passive: true });
})();
