import { defineCollection } from "astro:content";
import { z } from 'astro/zod'
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
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            country: z.string(),
            date: z.string(),
            images: z.array(
                z.object({
                    src: image(),
                    caption: z.string().optional(),
                    alt: z.string(),
                })
            ).optional().default([]),
        }),
});

export const collections = { blog, albums };
