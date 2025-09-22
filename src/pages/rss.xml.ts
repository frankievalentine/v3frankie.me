import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import rss from "@astrojs/rss";

export const GET = async () => {
  const posts = await getCollection("posts");

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      date: post.data.date,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
    trailingSlash: false,
  });
};
