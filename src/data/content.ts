// Textos del sitio fuera de «Mi trabajo» (ese vive en casos.ts). En inglés en / y en español en /es.

export interface Copy {
  /** Ruta de la otra versión: '/es' en la página en inglés y '/' en la española */
  toggleHref: string;
  nav: { about: string; work: string; skills: string; contact: string };
  /** Hero: frase partida alrededor de la palabra que rota en collage */
  heroPre: string;
  heroWords: string[];
  heroPrimary: string;
  heroPost: string;
  heroCta: string;
  aboutTitle: string;
  notes: { title: string; text: string }[];
  skillsTitle: string;
  skillGroups: { name: string; rows: { cat: string; items: string[] }[] }[];
  contactTitle: string;
  footer: string;
}

const en: Copy = {
  toggleHref: '/es',
  nav: { about: 'About', work: 'My work', skills: 'Skills', contact: 'Contact' },
  heroPre: 'I like to understand every',
  heroWords: ['stakeholder', 'user', 'client', 'partner'],
  heroPrimary: 'stakeholder',
  heroPost: ' before building, and to do it as a team.',
  heroCta: 'Get in touch',
  aboutTitle: 'About me.',
  notes: [
    { title: 'I show up before the code', text: 'I enjoy the stage where everything is still a question: sitting with the people who will use the product, understanding their day and sorting out what each party needs.' },
    { title: 'I build in conversation', text: 'My best ideas came from talking with the team and with customers. I bring proposals to the table and improve them with every objection.' },
    { title: 'I finish what I start', text: 'I don’t stop at the sketch: I connect it to data, payments, tests and deployment until someone actually uses it.' },
    { title: 'Paying attention to detail', text: 'A clearly explained error, a sale without internet, a button within thumb’s reach: those are the details I enjoy solving most.' },
  ],
  skillsTitle: 'My skills.',
  skillGroups: [
    {
      name: 'Product skills',
      rows: [
        { cat: 'Discovery', items: ['User research', 'Surveys', 'Market and product analysis', 'Stakeholder validation'] },
        { cat: 'Requirements', items: ['User stories', 'Acceptance criteria', 'Requirements tracking', 'MoSCoW prioritisation', 'Incremental delivery'] },
        { cat: 'Business', items: ['Stakeholder mediation', 'SaaS model', 'Pricing and plans', 'Customer support', 'Product metrics', 'Continuous feedback'] },
        { cat: 'AI and agents', items: ['Agent architecture', 'Subagents', 'Harness', 'Workflow orchestration', 'Model APIs', 'Structured JSON', 'Traceable AI'] },
      ],
    },
    {
      name: 'Design skills',
      rows: [
        { cat: 'UX', items: ['User-centred design', 'User flows', 'Information architecture', 'Friction reduction', 'Guided onboarding', 'Mobile UX', 'Error and offline states'] },
        { cat: 'UI and brand', items: ['Figma', 'Prototyping', 'Visual hierarchy', 'Design systems', 'Design tokens', 'Brand identity', 'Accessibility AA', 'Responsive'] },
      ],
    },
    {
      name: 'Engineering skills',
      rows: [
        { cat: 'Languages', items: ['PHP', 'TypeScript', 'JavaScript', 'SQL'] },
        { cat: 'Frameworks', items: ['Laravel 12', 'Livewire', 'Vue 3', 'Astro 5', 'Tailwind 4'] },
        { cat: 'Data', items: ['PostgreSQL + RLS', 'Multi-tenant', 'Redis', 'Dexie'] },
        { cat: 'Infrastructure', items: ['Docker', 'GCP', 'Terraform', 'Cloudflare', 'nginx'] },
        { cat: 'CI/CD', items: ['GitHub Actions', 'Multi-stage Docker', 'Health checks', 'Rollback runbook'] },
        { cat: 'Integrations', items: ['Stripe', 'Mercado Pago', 'MapLibre GL', 'OpenAPI', 'PWA'] },
      ],
    },
    {
      name: 'Control skills',
      rows: [
        { cat: 'Testing', items: ['Pest', 'PHPUnit', 'Vitest', 'Playwright', 'k6'] },
        { cat: 'Quality and security', items: ['Code review', 'PHPStan', 'Pint', 'ESLint', 'vue-tsc', 'Audit log'] },
      ],
    },
  ],
  contactTitle: 'Get in touch.',
  footer: '© 2026 Wilbert Díaz',
};

const es: Copy = {
  toggleHref: '/',
  nav: { about: 'Sobre mí', work: 'Mi trabajo', skills: 'Skills', contact: 'Contacto' },
  heroPre: 'Me gusta entender a cada',
  heroWords: ['interesado', 'usuario', 'cliente', 'socio'],
  heroPrimary: 'interesado',
  heroPost: ' antes de construir, y hacerlo en equipo.',
  heroCta: 'Contactar',
  aboutTitle: 'Sobre mí.',
  notes: [
    { title: 'Llego antes que el código', text: 'Disfruto la etapa en la que todo todavía es pregunta: sentarme con quien va a usar el producto, entender su día y ordenar lo que cada parte necesita.' },
    { title: 'Construyo en conversación', text: 'Mis mejores ideas salieron de hablar con el equipo y con los clientes. Llevo propuestas a la mesa y las mejoro con cada objeción.' },
    { title: 'Termino lo que empiezo', text: 'No me quedo en el boceto: lo conecto con datos, pagos, pruebas y despliegue hasta que alguien lo usa de verdad.' },
    { title: 'Poniendo atención al detalle', text: 'Un error bien explicado, una venta sin internet, un botón al alcance del pulgar: esos detalles son los que más disfruto resolver.' },
  ],
  skillsTitle: 'Mis skills.',
  skillGroups: [
    {
      name: 'Product skills',
      rows: [
        { cat: 'Descubrimiento', items: ['Investigación de usuarios', 'Encuestas', 'Análisis de mercado y producto', 'Validación con interesados'] },
        { cat: 'Requisitos', items: ['Historias de usuario', 'Criterios de aceptación', 'Seguimiento de requisitos', 'Priorización MoSCoW', 'Entregas incrementales'] },
        { cat: 'Negocio', items: ['Mediación entre interesados', 'Modelo SaaS', 'Precio y planes', 'Atención a clientes', 'Métricas de producto', 'Retroalimentación continua'] },
        { cat: 'IA y agentes', items: ['Arquitectura de agentes', 'Subagentes', 'Harness', 'Orquestación de flujos', 'APIs de modelos', 'JSON estructurado', 'IA trazable'] },
      ],
    },
    {
      name: 'Design skills',
      rows: [
        { cat: 'UX', items: ['Diseño centrado en el usuario', 'Flujos de usuario', 'Arquitectura de información', 'Reducción de fricción', 'Onboarding guiado', 'UX móvil', 'Estados de error y sin conexión'] },
        { cat: 'UI y marca', items: ['Figma', 'Prototipado', 'Jerarquía visual', 'Sistemas de diseño', 'Tokens de diseño', 'Identidad de marca', 'Accesibilidad AA', 'Responsive'] },
      ],
    },
    {
      name: 'Engineering skills',
      rows: [
        { cat: 'Lenguajes', items: ['PHP', 'TypeScript', 'JavaScript', 'SQL'] },
        { cat: 'Frameworks', items: ['Laravel 12', 'Livewire', 'Vue 3', 'Astro 5', 'Tailwind 4'] },
        { cat: 'Datos', items: ['PostgreSQL + RLS', 'Multi-tenant', 'Redis', 'Dexie'] },
        { cat: 'Infraestructura', items: ['Docker', 'GCP', 'Terraform', 'Cloudflare', 'nginx'] },
        { cat: 'CI/CD', items: ['GitHub Actions', 'Docker multi-stage', 'Health checks', 'Runbook de rollback'] },
        { cat: 'Integraciones', items: ['Stripe', 'Mercado Pago', 'MapLibre GL', 'OpenAPI', 'PWA'] },
      ],
    },
    {
      name: 'Control skills',
      rows: [
        { cat: 'Pruebas', items: ['Pest', 'PHPUnit', 'Vitest', 'Playwright', 'k6'] },
        { cat: 'Calidad y seguridad', items: ['Code review', 'PHPStan', 'Pint', 'ESLint', 'vue-tsc', 'Bitácora de auditoría'] },
      ],
    },
  ],
  contactTitle: 'Contáctame.',
  footer: '© 2026 Wilbert Díaz',
};

export const copy: Record<'en' | 'es', Copy> = { en, es };
