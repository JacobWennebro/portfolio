import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string().optional(),
    }),
});

const albums = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/albums" }),
    schema: z.object({
        name: z.string(),
        date: z.string(),
        images: z.array(
            z.object({
                src: z.string(),
                caption: z.string(),
            })
        ),
    }),
});

export const collections = { blog, albums };
