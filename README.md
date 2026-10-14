# Mi portafolio

Este es el código de mi portafolio, que puedes ver en [wilbertdiaz.github.io](https://wilbertdiaz.github.io). Ahí cuento quién soy, en qué proyectos he trabajado y cómo trabajo, en inglés y en español.

Lo hice con Astro y CSS escrito a mano. No usé librerías de animación: el collage del título, las pestañas y la galería de proyectos los programé yo.

## Para correrlo

```bash
npm install
npm run dev
```

`npm test` revisa que los datos de los proyectos estén completos y que las medidas de cada imagen coincidan con el archivo. `npm run build` deja el sitio listo en `dist/`.

## Dónde está cada cosa

- Los textos del sitio están en `src/data/content.ts`.
- Los proyectos de «Mi trabajo» están en `src/data/casos.ts`, y sus imágenes en `src/assets/work/`.
- Lo demás (componentes, scripts y estilos) está en `src/`.

Cada vez que subo cambios a `main`, GitHub corre las pruebas y publica el sitio solo.
