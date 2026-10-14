// Casos de «Mi trabajo» (formato revista gráfica).
// Agregar un caso o una lámina = editar solo este archivo y poner la imagen en src/assets/work/.
// `src` vacío = captura pendiente: se avisa en el build y esa lámina no se publica (salvo MOSTRAR_PENDIENTES=1);
// el caso sigue publicado mientras conserve su hero y al menos 2 láminas completas.

export type Locale = 'en' | 'es';
export type I18n = Record<Locale, string>;

export interface Shot {
  /** desktop y phone, como en el prompt; photo = fotografía vertical (bocetos del POS), sin bisel */
  device: 'desktop' | 'phone' | 'photo';
  /** Nombre del archivo dentro de src/assets/work/ */
  src: string;
  width: number;
  height: number;
  alt: I18n;
}

/** `why`: una línea que explica la decisión que muestra la lámina (máx. 180 caracteres). */
export type Plate =
  | { type: 'full'; title: I18n; why: I18n; shot: Shot }
  | { type: 'phones'; title: I18n; why: I18n; items: { label: I18n; shot: Shot }[] }
  /** Dos capturas de escritorio lado a lado (pipeline de bandas). */
  | { type: 'duo'; title: I18n; why: I18n; shots: [Shot, Shot] };

export interface Case {
  slug: string;
  /** Nombre del proyecto; si cambia por idioma, va como I18n. */
  name: string | I18n;
  headline: I18n;
  /** Por qué se diseñó así, bajo el titular del spread (máx. 180 caracteres). */
  intro: I18n;
  /** Sitio público del producto, si lo hay. */
  url?: string;
  /** Desktop; phone solo en productos que existen únicamente en celular (CunduaMap). */
  hero?: Shot;
  lead: I18n;
  plates: Plate[];
  /** «Qué hice»: viñetas al final del caso, con más detalle del trabajo y del proyecto (3 a 8). */
  hice: I18n[];
}

/** Pestañas por rol; una pestaña puede reunir varios casos (se eligen con un selector). */
export interface Pestana {
  id: string;
  label: I18n;
  casos: string[];
}

const tel = (src: string, alt: I18n, height = 1130): Shot => ({ device: 'phone', src, width: 648, height, alt });
const foto = (src: string, alt: I18n, width = 1500): Shot => ({ device: 'photo', src, width, height: 2000, alt });

export const casos: Case[] = [
  {
    slug: 'magisterpro',
    name: 'MagisterPro',
    url: 'https://magisterpro.com.mx',
    headline: { en: 'From the first survey to 250,000+ visits.', es: 'De la primera encuesta a más de 250 mil visitas.' },
    intro: { en: 'Teachers study in short breaks and many aren’t used to apps, so every screen does one thing and every question shows its source.', es: 'Los maestros estudian en ratos libres y muchos no están acostumbrados a las apps: cada pantalla hace una sola cosa y cada pregunta muestra su fuente.' },
    hero: { device: 'desktop', src: 'mp-inicio.png', width: 1600, height: 883, alt: { en: 'MagisterPro home page: “Prepare for your exam for real”', es: 'Página de inicio de MagisterPro: «Prepárate de verdad para tu examen»' } },
    lead: {
      en: 'I listened to teachers, principals and SEP enrolment first. Then I built what it took to sustain it.',
      es: 'Primero escuché a maestros, directores e inscripción SEP. Después construí lo necesario para sostenerlo.',
    },
    plates: [
      { type: 'full', title: { en: 'A message decided with teachers', es: 'Un mensaje decidido con maestros' }, why: { en: 'The message was decided with the teachers themselves: prepare for the exam for real, with no pirated questions or empty promises.', es: 'El mensaje se decidió con los propios maestros: prepararse de verdad para el examen, sin reactivos piratas ni promesas vacías.' }, shot: { device: 'desktop', src: 'mp-inicio.png', width: 1600, height: 883, alt: { en: 'MagisterPro home page: “Prepare for your exam for real”', es: 'Página de inicio de MagisterPro: «Prepárate de verdad para tu examen»' } } },
      {
        type: 'phones',
        title: { en: 'Rounds that fit a break', es: 'Rondas que caben en un recreo' }, why: { en: 'Surveys by schedule showed they study in short gaps, so practice comes in brief timed rounds, like a quick game.', es: 'Las encuestas por horario mostraron que estudian en ratos cortos: la práctica va en rondas breves, con tiempo, como una partida rápida.' },
        items: [
          { label: { en: 'Round with context', es: 'Ronda con contexto' }, shot: tel('mp-examen.webp', { en: 'Exam question with context, a timer and lives', es: 'Pregunta de examen con contexto, tiempo y vidas' }, 1204) },
          { label: { en: 'Practice history', es: 'Historial de prácticas' }, shot: tel('mp-historial.webp', { en: 'Practice history with a diagnosis for each exam', es: 'Historial de prácticas con diagnóstico de cada examen' }, 1204) },
        ],
      },
      { type: 'full', title: { en: 'Plans validated with teachers', es: 'Planes validados con maestros' }, why: { en: 'Price and plans were decided with the stakeholders themselves: a free plan to try it and a short, low-cost Pro plan.', es: 'El precio y los planes se decidieron con los propios interesados: un plan gratuito para probar y un Pro corto y de bajo costo.' }, shot: { device: 'desktop', src: 'mp-planes.webp', width: 2000, height: 1087, alt: { en: 'Subscription plans: free and Pro at $99 MXN for two weeks', es: 'Planes de suscripción: gratuito y Pro de $99 MXN por dos semanas' } } },
      { type: 'full', title: { en: 'Documents by population', es: 'Documentos por población' }, why: { en: 'Each promotion process has its own rules, so every official document is assigned to the populations who will see it in their exam.', es: 'Cada proceso de promoción tiene sus reglas: cada documento oficial se asigna a las poblaciones que de verdad lo verán en su examen.' }, shot: { device: 'desktop', src: 'mp-corpus.webp', width: 2000, height: 994, alt: { en: 'Legal corpus admin: assigning a document to the subprocesses that will see it', es: 'Administración del corpus legal: asignar un documento a los subprocesos que lo verán' } } },
    ],
    hice: [
      { en: "Founded the product and led discovery with surveys by promotion type and schedule.", es: "Fundé el producto y dirigí el descubrimiento con encuestas por tipo de promoción y por horario." },
      { en: "Set price, features and presentation with three stakeholder levels: teachers, principals and SEP enrolment.", es: "Definí precio, funciones y presentación con tres niveles de interesados: maestros, directores e inscripción SEP." },
      { en: "Designed the UX for low digital literacy: few actions per screen and short rounds.", es: "Diseñé la UX para baja alfabetización digital: pocas acciones por pantalla y rondas cortas." },
      { en: "Built it with Laravel and Livewire on multi-tenant PostgreSQL, with Stripe and Mercado Pago payments.", es: "La construí con Laravel y Livewire sobre PostgreSQL multi-tenant, con pagos en Stripe y Mercado Pago." },
      { en: "Handled customer support and automated email, and used exam metrics to improve the content.", es: "Atendí a los clientes, automaticé los correos y usé las métricas de cada examen para mejorar el contenido." },
      { en: "250,000+ visits, 1,500+ concurrent users and 250+ paying users, with top search rankings in its niche.", es: "Más de 250 mil visitas, más de 1,500 usuarios simultáneos y más de 250 usuarios de paga, entre los primeros resultados de búsqueda de su nicho." },
    ],
  },
  {
    slug: 'pos',
    name: 'POS Papel',
    headline: { en: 'Designed around how a cashier works.', es: 'Diseñado a partir de cómo trabaja un cajero.' },
    intro: { en: 'Cashiers work long shifts with a queue waiting and patchy internet, so the interface starts from paper and one obvious action.', es: 'Los cajeros trabajan turnos largos, con fila y con internet que se va: la interfaz parte del papel y de una sola acción evidente.' },
    hero: { device: 'desktop', src: 'pos-cobro-credito.webp', width: 1752, height: 1116, alt: { en: '“Charge sale” window: a credit sale with down payment and instalment plan', es: 'Ventana «Cobrar venta»: venta a crédito con enganche y plan de abonos' } },
    lead: {
      en: 'Built for another company: from a ruled notebook and paper prototypes to a sale that works offline. Sample data.',
      es: 'Hecho para otra empresa: de una libreta y prototipos en papel a una venta que funciona sin internet. Datos de ejemplo.',
    },
    plates: [
      {
        type: 'phones',
        title: { en: 'Where it started', es: 'Donde empezó' }, why: { en: 'I started from a ruled notebook: big totals, thin lines and ink on paper became the visual language of the system.', es: 'Partí de una libreta de rayas: totales grandes, líneas finas y tinta sobre papel se volvieron el lenguaje visual del sistema.' },
        items: [
          { label: { en: 'A ruled notebook', es: 'Una libreta de rayas' }, shot: foto('pos-libreta-portada.jpg', { en: 'Cover of a ruled school notebook', es: 'Portada de una libreta escolar de rayas' }) },
          { label: { en: 'First colour notes', es: 'Primeras notas de color' }, shot: foto('pos-libreta-notas.jpg', { en: 'Handwritten notes: thick red border, green for buttons', es: 'Notas a mano: borde rojo grueso, verde para los botones' }) },
        ],
      },
      {
        type: 'phones',
        title: { en: 'Paper prototype', es: 'Prototipo en papel' }, why: { en: 'Paper let me test the hierarchy before any code: the day’s total first, and critical actions like selling and charging kept apart.', es: 'El papel me dejó probar la jerarquía antes del código: primero el total del día, y las acciones críticas como vender y cobrar, separadas.' },
        items: [
          { label: { en: 'The day’s total first', es: 'Primero, el total del día' }, shot: foto('pos-prototipo-total.jpg', { en: 'Paper cut-out showing the day’s sales total', es: 'Recorte de papel con el total de ventas del día' }) },
          { label: { en: 'Separate critical actions', es: 'Acciones críticas separadas' }, shot: foto('pos-prototipo-mesa.jpg', { en: 'Sketch sheets: separate buttons for selling and charging', es: 'Hojas de bocetos: botones separados para vender y cobrar' }, 1102) },
        ],
      },
      { type: 'full', title: { en: 'A sale in one window', es: 'Una venta en una ventana' }, why: { en: 'A credit sale is solved in a single window: down payment, instalments and dates are calculated instantly, and offline the charge is saved on the register.', es: 'Una venta a crédito se resuelve en una sola ventana: enganche, abonos y fechas se calculan al instante, y sin internet el cobro se guarda en la caja.' }, shot: { device: 'desktop', src: 'pos-cobro-credito.webp', width: 1752, height: 1116, alt: { en: '“Charge sale” window: a credit sale with down payment and instalment plan', es: 'Ventana «Cobrar venta»: venta a crédito con enganche y plan de abonos' } } },
      { type: 'full', title: { en: 'The owner’s view', es: 'La vista del dueño' }, why: { en: 'The owner needs to know who owes what and when, so credit customers are sorted by their next payment and overdue ones stand out.', es: 'El dueño necesita saber quién debe y cuándo: los clientes a crédito se ordenan por su próximo abono y los atrasados resaltan.' }, shot: { device: 'desktop', src: 'pos-clientes.png', width: 1752, height: 1112, alt: { en: 'Customers on credit: due today, overdue and next instalment', es: 'Clientes a crédito: por cobrar hoy, atrasados y próximo abono' } } },
      { type: 'full', title: { en: 'Stock by branch', es: 'Inventario por sucursal' }, why: { en: 'Each branch keeps its own stock, with cost and margin in plain sight and a warning before a product runs out.', es: 'Cada sucursal lleva su propio inventario, con costo y margen a la vista y un aviso antes de que un producto se agote.' }, shot: { device: 'desktop', src: 'pos-inventario.png', width: 1752, height: 1120, alt: { en: 'Inventory by branch with price, cost, margin and low-stock alert', es: 'Inventario por sucursal con precio, costo, margen y aviso de bajo stock' } } },
    ],
    hice: [
      { en: "Studied cashiers in clothing, grocery and stationery shops before designing a single screen.", es: "Estudié a cajeros de tiendas de ropa, abarrotes y papelerías antes de diseñar una sola pantalla." },
      { en: "Prototyped on paper and explored visual directions before choosing one.", es: "Prototipé en papel y exploré direcciones visuales antes de elegir una." },
      { en: "Put the whole visual system into design tokens in a single file.", es: "Llevé todo el sistema visual a tokens de diseño en un solo archivo." },
      { en: "Sales keep working offline and sync without duplicates.", es: "La venta sigue sin internet y se sincroniza sin duplicarse." },
      { en: "Each business is isolated in the database, and sensitive actions go to an audit log with a written reason.", es: "Cada negocio está aislado en la base de datos y las acciones delicadas quedan en una bitácora con su motivo." },
      { en: "32 business-rule tests and 43 end-to-end tests.", es: "32 pruebas de reglas de negocio y 43 de extremo a extremo." },
      { en: "Vue 3, Laravel and PostgreSQL; the screenshots use sample data.", es: "Vue 3, Laravel y PostgreSQL; las capturas usan datos de ejemplo." },
    ],
  },
  {
    slug: 'cunduamap',
    name: 'CunduaMap',
    url: 'https://cunduamap.com',
    headline: { en: 'UX for a festival crowd.', es: 'UX para la multitud de un festival.' },
    intro: { en: 'Visitors use it for a few days, standing in the sun: nothing to type, nothing to learn and a map that only shows the town.', es: 'Los turistas la usan unos días, de pie y bajo el sol: nada que escribir, nada que aprender y un mapa que solo muestra el pueblo.' },
    hero: tel('cundua-lugar.webp', { en: 'Place card for the Parroquia La Natividad de María, already in the route', es: 'Ficha de la Parroquia La Natividad de María, ya en la ruta' }),
    lead: {
      en: 'Hurried visitors, sun on the screen, a town they don’t know: nothing to type and a map that won’t let you get lost.',
      es: 'Turistas con prisa, sol en la pantalla y un pueblo desconocido: nada que escribir y un mapa que no deja perderse.',
    },
    plates: [
      {
        type: 'phones',
        title: { en: 'Nothing to type', es: 'Nada que escribir' }, why: { en: 'Typing on a phone in the street is slow and error-prone, so the route is built with buttons only, in 7 or 8 taps.', es: 'Escribir en el celular en plena calle es lento y propenso a errores: la ruta se arma solo con botones, en 7 u 8 toques.' },
        items: [
          { label: { en: 'Pick what to do', es: 'Elige qué hacer' }, shot: tel('cundua-cuestionario.webp', { en: '“What would you like to do?” with button options', es: '«¿Qué te gustaría hacer?» con opciones en botones' }) },
          { label: { en: 'Add it to your route', es: 'Agrégalo a tu ruta' }, shot: tel('cundua-lugar.webp', { en: 'Place card already added to the route', es: 'Ficha de un lugar ya agregado a la ruta' }) },
        ],
      },
      {
        type: 'phones',
        title: { en: 'A route that checks the hours', es: 'Una ruta que revisa horarios' }, why: { en: 'A route is useless if a place is closed when you arrive, so each stop checks its opening hours against the time of your visit.', es: 'Una ruta no sirve si el lugar está cerrado al llegar: cada parada revisa su horario contra la hora de tu visita.' },
        items: [
          { label: { en: 'Edit your stops', es: 'Edita tus paradas' }, shot: tel('cundua-paradas.webp', { en: 'Editing route stops, with opening hours checked', es: 'Edición de paradas de la ruta, con horario verificado' }) },
          { label: { en: 'Festival schedule', es: 'Programa del festival' }, shot: tel('cundua-programa.webp', { en: 'Festival schedule by time', es: 'Programa del festival por horario' }) },
        ],
      },
    ],
    hice: [
      { en: "Designed and built the web app for a barbecue festival in a town in southeastern Mexico, in about two weeks.", es: "Diseñé y construí la app web de un festival de la barbacoa en un municipio del sureste mexicano, en unas dos semanas." },
      { en: "Balanced visitors and vendors: no paid placement, honest results.", es: "Equilibré a turistas y locatarios: sin posicionamiento pagado, resultados honestos." },
      { en: "Vendors drop a pin on the map instead of typing an address.", es: "El locatario pone su pin en el mapa en lugar de escribir la dirección." },
      { en: "Visitors read from a CDN, so the server is never in their way.", es: "El turista lee desde una CDN: el servidor nunca está en su camino." },
      { en: "No tracking cookies and no stored location.", es: "Sin cookies de rastreo y sin guardar la ubicación." },
      { en: "40 businesses published; Vue 3, MapLibre GL and Laravel.", es: "40 negocios publicados; Vue 3, MapLibre GL y Laravel." },
    ],
  },
  {
    slug: 'softcoob',
    name: 'SoftCoob',
    headline: { en: 'One studio, one voice.', es: 'Un estudio, una sola voz.' },
    intro: { en: 'Business owners arrive from paper, WhatsApp and spreadsheets, so the site leads them from that reality to a single action.', es: 'Los dueños de negocio llegan desde el papel, WhatsApp y hojas de cálculo: el sitio los lleva de esa realidad a una sola acción.' },
    hero: { device: 'desktop', src: 'sitio-inicio.webp', width: 2000, height: 1114, alt: { en: 'SoftCoob home: “Turn your business into software”', es: 'Inicio de SoftCoob: «Convierte tu negocio en software»' } },
    lead: {
      en: 'A journey that explains, guides and ends in a single action: a quote on WhatsApp.',
      es: 'Un recorrido que explica, guía y termina en una sola acción: cotizar por WhatsApp.',
    },
    plates: [
      { type: 'full', title: { en: 'Home', es: 'Inicio' }, why: { en: 'One message and one button: in seconds the visitor knows what SoftCoob does and how to start.', es: 'Un mensaje y un botón: en segundos se entiende qué hace SoftCoob y cómo empezar.' }, shot: { device: 'desktop', src: 'sitio-inicio.webp', width: 2000, height: 1114, alt: { en: 'SoftCoob home: one message and one action', es: 'Inicio de SoftCoob: un mensaje y una acción' } } },
      { type: 'full', title: { en: 'Five stages, one at a time', es: 'Cinco etapas, una a la vez' }, why: { en: 'The process is told one stage at a time, so a first-time visitor isn’t asked to read everything at once.', es: 'El proceso se cuenta una etapa a la vez, para no pedirle a quien llega por primera vez que lea todo de golpe.' }, shot: { device: 'desktop', src: 'sitio-proceso.webp', width: 2000, height: 1091, alt: { en: 'Process in five stages, stage 02: Design', es: 'Proceso en cinco etapas, etapa 02: Diseñar' } } },
      {
        type: 'phones',
        title: { en: 'A quote in four steps', es: 'Cotizar en cuatro pasos' }, why: { en: 'Instead of a generic form, visitors pick their business and get a recommendation that continues on WhatsApp, a channel they already use.', es: 'En lugar de un formulario genérico, el visitante elige su giro y recibe una recomendación que sigue por WhatsApp, un canal que ya usa.' },
        items: [
          { label: { en: 'Pick your business', es: 'Elige tu giro' }, shot: tel('sitio-cotizador-categoria.webp', { en: 'Quote builder, step 1: business category', es: 'Cotizador, paso 1: categoría del negocio' }) },
          { label: { en: 'Talk on WhatsApp', es: 'Sigue por WhatsApp' }, shot: tel('sitio-cotizador-recomendacion.webp', { en: 'Quote builder, step 4: recommendation and WhatsApp button', es: 'Cotizador, paso 4: recomendación y botón de WhatsApp' }) },
        ],
      },
    ],
    hice: [
      { en: "Designed and built the SoftCoob site in Astro, with no JavaScript by default.", es: "Diseñé y construí el sitio de SoftCoob en Astro, sin JavaScript por defecto." },
      { en: "A 4-step guided quote builder for 10+ business types, in MXN or USD.", es: "Un cotizador guiado de 4 pasos para más de 10 giros, en MXN o USD." },
      { en: "An automatic tour with pause, skip and a progress bar that screen readers can follow.", es: "Un recorrido automático con pausa, salto y barra de progreso que siguen los lectores de pantalla." },
      { en: "A 516-line quality guide, design tokens and deployment with Docker and nginx.", es: "Una guía de calidad de 516 líneas, tokens de diseño y despliegue con Docker y nginx." },
    ],
  },
  {
    slug: 'ia',
    name: { en: 'AI in my projects', es: 'IA en mis proyectos' },
    headline: { en: 'AI where it saves time, a person where it matters.', es: 'IA donde ahorra tiempo, una persona donde importa.' },
    intro: {
      en: 'I orchestrate agents by level, each with one role and a person approving between levels; in MagisterPro, AI writes and configures exams with traceable outputs.',
      es: 'Orquesto agentes por niveles, cada uno con un rol y una persona que aprueba entre niveles; en MagisterPro, la IA redacta y configura exámenes trazables.',
    },
    hero: { device: 'desktop', src: 'mp-banco-preguntas.webp', width: 2000, height: 939, alt: { en: 'Question bank: each variant links to its source document and page', es: 'Banco de preguntas: cada variante enlaza a su documento y página de origen' } },
    lead: {
      en: 'I use model APIs inside products and agents in my own process, always with a person reviewing before anything moves on.',
      es: 'Uso APIs de modelos dentro de los productos y agentes en mi propio proceso, siempre con una persona que revisa antes de avanzar.',
    },
    plates: [
      { type: 'full', title: { en: 'Traceable to the page', es: 'Trazable hasta la página' }, why: { en: 'AI writes the questions, but each one keeps a link to the document and page it came from, so it can be checked, not just trusted.', es: 'La IA redacta las preguntas, pero cada una conserva el enlace al documento y la página de donde sale: se puede revisar, no solo confiar.' }, shot: { device: 'desktop', src: 'mp-banco-preguntas.webp', width: 2000, height: 939, alt: { en: 'Question bank: each variant links to its source document and page', es: 'Banco de preguntas: cada variante enlaza a su documento y página de origen' } } },
      {
        type: 'phones',
        title: { en: 'Exams set up in real time', es: 'Exámenes armados en tiempo real' },
        why: { en: 'Teachers choose the weight of each area and the exam is built on the spot; afterwards every item can be reviewed, right or wrong.', es: 'El maestro elige el peso de cada área y el examen se arma al momento; después cada reactivo se puede revisar, bien o mal.' },
        items: [
          { label: { en: 'Weight by area', es: 'Peso por área' }, shot: tel('mp-configuracion.webp', { en: 'Exam setup: weight of each study area', es: 'Configuración del examen: peso de cada área de estudio' }) },
          { label: { en: 'Item review', es: 'Revisión de reactivos' }, shot: tel('mp-reactivos.webp', { en: 'Item navigator with correct and incorrect answers', es: 'Navegador de reactivos con correctas e incorrectas' }) },
        ],
      },
      {
        type: 'duo',
        title: { en: 'Band pipeline', es: 'Pipeline de bandas' },
        why: { en: 'Content is generated in bands: each one reads a page range under strict rules and returns JSON with a fixed shape that is validated before the next.', es: 'El contenido se genera por bandas: cada una lee un rango de páginas con reglas estrictas y devuelve JSON con forma fija que se valida antes de la siguiente.' },
        shots: [
          { device: 'desktop', src: 'ia-banda-1.png', width: 1512, height: 1279, alt: { en: 'Band 1 prompt: page range, target process, priority subject and the rules for the iteration', es: 'Instrucción de la banda 1: rango de páginas, proceso de destino, sujeto prioritario y reglas de la iteración' } },
          { device: 'desktop', src: 'ia-banda-2.png', width: 1520, height: 1280, alt: { en: 'Band 2 JSON output: distractor pattern and variants by subject, problem and setting', es: 'Salida JSON de la banda 2: patrón de distractor y variantes por sujeto, problemática y ámbito' } },
        ],
      },
    ],
    hice: [
      { en: "Orchestrated agents by level: a main agent splits the work among subagents, each with a single role, and each level hands its result to the next.", es: "Orquesté agentes por niveles: un agente principal reparte el trabajo entre subagentes con un solo rol, y cada nivel entrega su resultado al siguiente." },
      { en: "The levels cover market and product analysis, software requirements, and software and UX design, all before any code.", es: "Los niveles cubren análisis de mercado y de producto, requisitos de software, y diseño de software y UX, todo antes del código." },
      { en: "A person approves between levels before anything moves on.", es: "Una persona aprueba entre niveles antes de que algo avance." },
      { en: "A harness with each project’s rules, context and skills, read alike by people and agents.", es: "Un harness con las reglas, el contexto y las habilidades de cada proyecto, que leen por igual personas y agentes." },
      { en: "In MagisterPro, model services over APIs with structured JSON outputs organised in bands.", es: "En MagisterPro, servicios de modelos por API con salidas en JSON estructurado, organizadas en bandas." },
      { en: "Every generated question keeps its source: document and page.", es: "Cada pregunta generada conserva su fuente: documento y página." },
    ],
  },
];

export const pestanas: Pestana[] = [
  { id: 'lider', label: { en: 'As a leader…', es: 'Como líder…' }, casos: ['magisterpro'] },
  { id: 'equipo', label: { en: 'As a teammate…', es: 'Como compañero…' }, casos: ['pos', 'cunduamap', 'softcoob'] },
  { id: 'ia', label: { en: 'With AI in my process…', es: 'Con IA en mi proceso…' }, casos: ['ia'] },
];

export const ui: Record<Locale, { tabs: string; projects: string; hint: string; did: string; open: string; openCase: string; close: string; next: string }> = {
  en: { tabs: 'My work', projects: 'Projects', hint: 'Press to view', did: 'What I did', open: 'Open the case', openCase: 'Open the {name} case', close: 'Close', next: 'Next case' },
  es: { tabs: 'Mi trabajo', projects: 'Proyectos', hint: 'Presiona para ver', did: 'Qué hice', open: 'Abrir el caso', openCase: 'Abrir el caso {name}', close: 'Cerrar', next: 'Siguiente caso' },
};
