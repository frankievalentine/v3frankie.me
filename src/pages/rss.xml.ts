import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");

  return rss({
    title: "Frankie Valentine",
    description:
      "Frankie Valentine's writing on creative process, photography, and building things on the web.",
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/posts/${post.id}/`,
      })),
    customData: "<language>en-us</language>",
  });
}
