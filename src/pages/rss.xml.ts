import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { siteConfig } from "@/config/site"

export const GET = async () => {
  const posts = await getCollection("posts")

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate,
      description: post.data.description,
      customData: post.data.customData,
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
    trailingSlash: false,
    stylesheet: "/rss/styles.xsl",
  })
}
