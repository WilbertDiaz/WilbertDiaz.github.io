// Talla y superficie — motion. Añade .is-in al entrar en viewport y .is-scrolled al encabezado.
// Cargar con <script> inline en <head>: document.documentElement.classList.add('js') y este módulo al final del body.
(() => {
  const d = document.documentElement;
  d.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-rev]');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); }
  else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    els.forEach(e => io.observe(e));
    // Saltos (anclas, Home/End): marcar todo lo que ya quedó por encima del borde inferior
    let last = 0;
    const check = () => {
      const now = Date.now(); if (now - last < 80) return; last = now;
      els.forEach(e => { if (!e.classList.contains('is-in') && e.getBoundingClientRect().top < innerHeight * 0.92) { e.classList.add('is-in'); io.unobserve(e); } });
    };
    document.addEventListener('scroll', check, { passive: true, capture: true });
    addEventListener('resize', check);
    check();
  }
  const h = document.querySelector('.encabezado');
  if (h) {
    const s = document.createElement('div');
    s.style.cssText = 'position:absolute;top:24px;height:1px;width:1px;pointer-events:none';
    document.body.prepend(s);
    new IntersectionObserver(([e]) => h.classList.toggle('is-scrolled', !e.isIntersecting)).observe(s);
  }
})();
