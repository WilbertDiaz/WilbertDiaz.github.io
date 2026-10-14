import { defineConfig } from 'astro/config';

export default defineConfig({
  // GitHub Pages con repositorio de usuario (WilbertDiaz.github.io): se sirve en la raíz, sin `base`
  site: 'https://wilbertdiaz.github.io',
  // Sin la barra flotante de Astro en desarrollo («by Astro» al pie de la pantalla)
  devToolbar: { enabled: false },
});
