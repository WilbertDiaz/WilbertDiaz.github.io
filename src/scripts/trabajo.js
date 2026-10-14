// «Mi trabajo»: pestañas ARIA con ?work=, spread que entra al cambiar y un modal de caso con ?case=,
// «atrás» del navegador para cerrar y «Siguiente caso» sin cerrar.
const raiz = document.querySelector('[data-mt]');
const dlg = document.getElementById('caso-modal');
const html = document.documentElement;
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const conParam = (clave, valor) => {
  const u = new URL(location.href);
  valor ? u.searchParams.set(clave, valor) : u.searchParams.delete(clave);
  return u;
};

/* ───── Pestañas por rol; una pestaña puede reunir varios casos con su selector ───── */
const tabs = raiz ? [...raiz.querySelectorAll('[role="tab"]')] : [];
const paneles = raiz ? [...raiz.querySelectorAll('[role="tabpanel"]')] : [];
let actual = Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'));
const casoDe = (panel) => panel?.querySelector('[data-spread]:not([hidden])')?.dataset.spread;
const panelDe = (slug) => paneles.findIndex((p) => p.querySelector(`[data-spread="${slug}"]`));

const entrar = (el) => {
  el.classList.remove('entra');
  void el.offsetWidth; // reinicia la animación de entrada
  el.classList.add('entra');
};

const llevarAlCarril = (el) => {
  // Carril horizontal (pestañas o selector): se mueve solo el carril, nunca el scroll de la página
  const carril = el.parentElement;
  if (carril.scrollWidth <= carril.clientWidth) return;
  // El elemento queda alineado al inicio del carril (o el carril vuelve a 0 si es el primero), sin cortes a medias
  const izq = el === carril.firstElementChild ? 0 : el.offsetLeft - carril.offsetLeft;
  if (izq < carril.scrollLeft || el.offsetLeft - carril.offsetLeft + el.offsetWidth > carril.scrollLeft + carril.clientWidth) {
    carril.scrollTo({ left: izq, behavior: reducido() ? 'auto' : 'smooth' });
  }
};

const elegirCaso = (slug, { url = true, animar = true } = {}) => {
  const i = panelDe(slug);
  if (i < 0) return;
  const panel = paneles[i];
  panel.querySelectorAll('[data-spread]').forEach((sp) => {
    const es = sp.dataset.spread === slug;
    if (es && sp.hidden && animar) entrar(sp);
    sp.hidden = !es;
  });
  panel.querySelectorAll('[data-elegir]').forEach((b) => {
    const es = b.dataset.elegir === slug;
    b.setAttribute('aria-pressed', String(es));
    if (es) llevarAlCarril(b);
  });
  if (url) history.replaceState(history.state, '', conParam('work', slug));
};

const activar = (i, { foco = false, url = true, animar = true } = {}) => {
  if (!tabs[i]) return;
  const cambia = i !== actual;
  actual = i;
  tabs.forEach((t, k) => {
    t.setAttribute('aria-selected', String(k === i));
    t.tabIndex = k === i ? 0 : -1;
  });
  paneles.forEach((p, k) => {
    p.hidden = k !== i;
    if (k === i && cambia && animar) entrar(p);
  });
  if (foco) tabs[i].focus();
  llevarAlCarril(tabs[i]);
  if (url) history.replaceState(history.state, '', conParam('work', casoDe(paneles[i])));
};

if (raiz) {
  const pedido = new URL(location.href).searchParams.get('work');
  const enPanel = pedido ? panelDe(pedido) : -1;
  if (enPanel >= 0) {
    activar(enPanel, { url: false, animar: false });
    elegirCaso(pedido, { url: false, animar: false });
  }
  tabs.forEach((t, i) => t.addEventListener('click', () => activar(i)));
  raiz.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
    const n = { ArrowRight: actual + 1, ArrowLeft: actual - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (n === undefined) return;
    e.preventDefault();
    activar((n + tabs.length) % tabs.length, { foco: true });
    window.__rotarTrabajo?.();
  });
  raiz.querySelectorAll('[data-elegir]').forEach((b) => b.addEventListener('click', () => elegirCaso(b.dataset.elegir)));

  /* Rotación de proyectos en las pestañas que reúnen varios: cada ROTA ms pasa al siguiente.
     Se pausa con el cursor encima, con el foco dentro, fuera de pantalla, con la pestaña o el modal cerrados u ocultos;
     se detiene si la persona elige un proyecto a mano; no corre con movimiento reducido. */
  const ROTA = 6000;
  // Visible = la sección ocupa la franja central de la pantalla (se calcula con el scroll, como el resto del sitio)
  const enPantalla = () => {
    const r = raiz.getBoundingClientRect();
    return r.top < innerHeight * 0.65 && r.bottom > innerHeight * 0.35;
  };
  const rotaciones = paneles.map((panel) => {
    const botones = [...panel.querySelectorAll('[data-elegir]')];
    if (botones.length < 2) return null;
    let timer = 0;
    let encima = false;
    let manual = false;
    const programar = () => {
      clearTimeout(timer);
      panel.classList.remove('rota');
      if (manual || encima || reducido() || panel.hidden || !enPantalla() || document.hidden || dlg?.open) return;
      void panel.offsetWidth; // reinicia la línea de progreso
      panel.classList.add('rota');
      timer = setTimeout(() => {
        if (!enPantalla() || document.hidden || panel.hidden) { programar(); return; } // se salió de vista sin aviso
        const i = botones.findIndex((b) => b.getAttribute('aria-pressed') === 'true');
        elegirCaso(botones[(i + 1) % botones.length].dataset.elegir, { url: false });
        programar();
      }, ROTA);
    };
    const pausar = (si) => { encima = si; programar(); };
    panel.addEventListener('pointerenter', () => pausar(true));
    panel.addEventListener('pointerleave', () => pausar(false));
    panel.addEventListener('focusin', () => pausar(true));
    panel.addEventListener('focusout', (e) => { if (!panel.contains(e.relatedTarget)) pausar(false); });
    botones.forEach((b) => b.addEventListener('click', () => { manual = true; programar(); }));
    return programar;
  });
  window.__rotarTrabajo = () => rotaciones.forEach((f) => f?.());
  tabs.forEach((t) => t.addEventListener('click', window.__rotarTrabajo));
  document.addEventListener('visibilitychange', window.__rotarTrabajo);
  let estabaVisible = enPantalla();
  addEventListener('scroll', () => {
    const ahora = enPantalla();
    if (ahora !== estabaVisible) { estabaVisible = ahora; window.__rotarTrabajo(); }
  }, { passive: true });
  window.__rotarTrabajo();
  // Precarga de los hero que no están a la vista, después de la primera pintura
  const despues = window.requestIdleCallback ?? ((f) => setTimeout(f, 1200));
  despues(() => raiz.querySelectorAll('[hidden] img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; }));
}

/* ───── Modal de caso ───── */
if (dlg) {
  const marco = dlg.querySelector('.cm-marco');
  const articulos = new Map([...dlg.querySelectorAll('[data-caso]')].map((a) => [a.dataset.caso, a]));
  let opener = null;
  let porPush = false;
  let cerrando = 0;

  const precargar = (slug) => articulos.get(slug)?.querySelectorAll('[data-primera] img').forEach((img) => { img.loading = 'eager'; });

  const mostrar = (slug) => {
    articulos.forEach((a, s) => { a.hidden = s !== slug; });
    dlg.setAttribute('aria-labelledby', `cm-h-${slug}`);
    precargar(slug);
    marco.scrollTop = 0;
    articulos.get(slug).querySelector('.cm-h').focus({ preventScroll: true });
    // La pestaña de fondo, su proyecto y ?work= acompañan al caso
    const i = panelDe(slug);
    if (i >= 0) {
      activar(i, { url: false, animar: false });
      elegirCaso(slug, { animar: false });
    }
  };

  const abrir = (slug, { push = true } = {}) => {
    if (!articulos.has(slug)) return;
    clearTimeout(cerrando);
    if (!dlg.open) {
      opener = document.activeElement;
      html.classList.add('modal-abierto');
      dlg.classList.remove('is-cerrando');
      dlg.showModal();
      window.__rotarTrabajo?.(); // el modal abierto detiene la rotación
      void dlg.offsetWidth; // fija el estado inicial para que la transición de entrada corra
      dlg.classList.add('is-abierto');
    }
    mostrar(slug);
    if (push) {
      history.pushState({ caso: slug }, '', conParam('case', slug));
      porPush = true;
    }
  };

  const cerrarVista = () => {
    dlg.classList.remove('is-abierto');
    dlg.classList.add('is-cerrando');
    cerrando = setTimeout(() => {
      dlg.close();
      dlg.classList.remove('is-cerrando');
      html.classList.remove('modal-abierto');
      // Si la pestaña cambió con «Siguiente caso», el botón que abrió quedó oculto: el foco va al de la pestaña activa
      const visible = opener && document.contains(opener) && opener.offsetParent !== null;
      const destino = visible ? opener : paneles[actual]?.querySelector('[data-spread]:not([hidden]) .abrir');
      destino?.focus({ preventScroll: true });
      window.__rotarTrabajo?.();
      opener = null;
    }, reducido() ? 150 : 400);
  };

  const cerrar = () => {
    if (!dlg.open || dlg.classList.contains('is-cerrando')) return;
    if (porPush && history.state?.caso) {
      history.back(); // el popstate cierra
    } else {
      history.replaceState(null, '', conParam('case', null));
      cerrarVista();
    }
  };

  document.querySelectorAll('[data-abrir]').forEach((b) => {
    b.addEventListener('click', () => abrir(b.dataset.abrir));
    b.addEventListener('pointerenter', () => precargar(b.dataset.abrir));
    b.addEventListener('focus', () => precargar(b.dataset.abrir));
  });
  dlg.querySelectorAll('[data-cerrar]').forEach((b) => b.addEventListener('click', cerrar));
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); cerrar(); });
  dlg.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => {
    mostrar(b.dataset.ir);
    history.replaceState({ caso: b.dataset.ir }, '', conParam('case', b.dataset.ir));
  }));

  addEventListener('popstate', () => {
    const slug = new URL(location.href).searchParams.get('case');
    if (slug && articulos.has(slug)) abrir(slug, { push: false });
    else if (dlg.open) {
      porPush = false;
      // Al volver, la URL recupera la pestaña que quedó activa (pudo cambiar con «Siguiente caso»)
      if (paneles[actual]) history.replaceState(history.state, '', conParam('work', casoDe(paneles[actual])));
      cerrarVista();
    }
  });

  const deEntrada = new URL(location.href).searchParams.get('case');
  if (deEntrada && articulos.has(deEntrada)) abrir(deEntrada, { push: false });
}
