import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kind: z.string(),
    status: z.string(),
    featured: z.boolean(),
    order: z.number(),
    stack: z.array(z.string()),
    links: z
      .object({
        website: z.url().optional(),
        repository: z.url().optional(),
      })
      .optional(),
  }),
});

export const collections = { posts, projects };
