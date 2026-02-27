/// <reference types="astro/client" />

declare global {
  interface Window {
    basecoat?: {
      stop: () => void;
      initAll: () => void;
      start: () => void;
      init: (component: string) => void;
    };
  }
}
