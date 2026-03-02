/// <reference types="astro/client" />

export {};

declare global {
  interface Window {
    basecoat?: {
      stop: () => void;
      initAll: () => void;
      start: () => void;
      init: (component: string) => void;
    };
  }

  interface PagefindResult {
    content: string;
    excerpt: string;
    meta: {
      title?: string;
      image?: string;
      image_alt?: string;
    };
    url: string;
  }

  interface PagefindSearchResult {
    data: () => Promise<PagefindResult>;
  }
}
