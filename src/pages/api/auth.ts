export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const GET: APIRoute = ({ url }) => {
    const clientId = env.GITHUB_CLIENT_ID;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${url.origin}/api/callback`,
        scope: "repo,user",
    });

    return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
    );
};
