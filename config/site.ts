import type { SiteConfig } from "@/utils/types"

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/HeadIndex.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: "Frankie Valentine",
  // Meta property used to construct the meta title property, found in src/components/HeadIndex.astro L:11
  title: "v3frankie.me",
  url: "https://v3frankie.me",
  // Meta property used as the default description meta property
  description: "Frankie Valentine's personal website",
  // HTML lang property, found in src/layouts/Base.astro L:18
  lang: "en-US",
  // Meta property, found in src/components/HeadIndex.astro L:42
  ogLocale: "en_US",
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: "en-US",
    // options: {
    //   month: "long",
    //   day: "numeric",
    //   year: "numeric",
    // },
  },
}
