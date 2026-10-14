# Portafolio · Wilbert Díaz

Sitio bilingüe (inglés en `/`, español en `/es`) hecho con [Astro](https://astro.build), sin frameworks de UI ni dependencias de animación.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm test         # pruebas (node --test): collage del hero y datos de «Mi trabajo»
npm run build    # sitio estático en dist/
```

## Estructura

- `src/data/content.ts`: textos del sitio en ambos idiomas.
- `src/data/casos.ts`: casos de «Mi trabajo» (pestañas, láminas, capturas). Las imágenes viven en `src/assets/work/`; las medidas de cada una se validan contra el archivo en las pruebas.
- `src/components/`, `src/scripts/`, `src/styles/`: componentes, comportamiento y estilos (tokens en `tokens.css`, temas claro y oscuro).

## Publicación

Cada push a `main` corre las pruebas, construye y publica en GitHub Pages (`.github/workflows/deploy.yml`).
