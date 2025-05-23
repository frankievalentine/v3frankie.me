import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import rss from "@astrojs/rss";

export const GET = async () => {
	const posts = await getCollection("posts");

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteConfig.url,
		// @ts-ignore
		items: posts.map(
			(post: {
				data: { title: any; date: any; description: any; customData: any };
				slug: any;
			}) => ({
				title: post.data.title,
				date: post.data.date,
				description: post.data.description,
				customData: post.data.customData,
				// Compute RSS link from post `slug`
				// This example assumes all posts are rendered as `/posts/[slug]` routes
				link: `/posts/${post.slug}/`,
			}),
		),
		customData: `<language>en-us</language>`,
		trailingSlash: false,
	});
};
