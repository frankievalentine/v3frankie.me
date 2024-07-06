export type SiteConfig = {
  author: string
  title: string
  description: string
  lang: string
  ogLocale: string
  date: {
    locale: string | string[] | undefined
    // options: Intl.DateTimeFormatOptions
  }
}

export type Content = {
  "content-type": string
  value: string
  html: string
  text: string
}
