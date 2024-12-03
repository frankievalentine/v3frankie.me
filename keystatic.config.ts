// keystatic.config.ts
import { collection, config, fields } from "@keystatic/core"

export default config({
  storage: {
    kind: "local",
  },
  // storage: {
  //   kind: "github",
  //   repo: {
  //     owner: "frankievalentine",
  //     name: "v3frankie.me",
  //   },
  // },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.ignored(),
        date: fields.date({ label: "Published Date" }),
        content: fields.mdx({
          label: "Content",
          options: {
            // Use Astro Image component for uploaded images
            image: {
              directory: "src/assets/images/posts",
              publicPath: "@assets/images/posts/",
            },
          },
        }),
      },
    }),
  },
})
