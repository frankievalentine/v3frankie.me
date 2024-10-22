export type SiteConfig = {
  author: string
  title: string
  url: string
  description: string
  lang: string
  ogLocale: string
  date: {
    locale: string | string[] | undefined
    // options: Intl.DateTimeFormatOptions
  }
}

export type SiteMeta = {
  title: string
  description?: string
  // ogImage?: string | undefined
  // articleDate?: string | undefined
}

export type Content = {
  "content-type": string
  value: string
  html: string
  text: string
}
