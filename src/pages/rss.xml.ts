import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    const posts = (await getCollection("blog")).sort(
        (a, b) =>
            new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );

    return rss({
        title: "Jacob Wennebro",
        description:
            "Thoughts on software, self-hosting, travel, and whatever else feels worth writing down.",
        site: context.site!,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: new Date(post.data.date),
            description: post.data.description ?? "",
            link: `/blog/${post.id}`,
        })),
    });
}
