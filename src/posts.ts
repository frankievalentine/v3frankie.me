import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export const POSTS_PER_PAGE = 6;

export type Post = CollectionEntry<"posts">;

export async function getSortedPosts(): Promise<Post[]> {
	return (await getCollection("posts")).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
}

export function getPostsPageCount(postCount: number): number {
	return Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE));
}

export function getPostsPagePath(page: number): string {
	return page === 1 ? "/posts/" : `/posts/page/${page}/`;
}

export function getPostsForPage(posts: Post[], page: number): Post[] {
	const start = (page - 1) * POSTS_PER_PAGE;
	return posts.slice(start, start + POSTS_PER_PAGE);
}
