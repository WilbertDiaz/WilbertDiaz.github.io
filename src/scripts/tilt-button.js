// Botón con inclinación 3D: escribe variables CSS una vez por frame; el transform, el reflejo y la sombra
// se calculan en CSS (botones.md, Reglas 8 a 11). Se mide el envoltorio, no el botón inclinado.
for (const wrap of document.querySelectorAll('[data-tilt]')) {
  let raf = 0;
  let estado = null;
  const escribir = () => {
    raf = 0;
    if (!estado) return;
    wrap.style.setProperty('--x', estado.x.toFixed(4));
    wrap.style.setProperty('--y', estado.y.toFixed(4));
    wrap.style.setProperty('--dx', (estado.x - 0.5).toFixed(4));
    wrap.style.setProperty('--dy', (estado.y - 0.5).toFixed(4));
    wrap.style.setProperty('--on', String(estado.on));
    wrap.classList.toggle('is-on', estado.on === 1);
  };
  const pedir = () => { if (!raf) raf = requestAnimationFrame(escribir); };
  const seguir = (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return; // en táctil no hay inclinación
    const r = wrap.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    estado = { x, y, on: 1 };
    pedir();
  };
  wrap.addEventListener('pointerenter', seguir);
  wrap.addEventListener('pointermove', seguir);
  wrap.addEventListener('pointerleave', () => {
    estado = { x: 0.5, y: 0.5, on: 0 };
    pedir();
  });
}
