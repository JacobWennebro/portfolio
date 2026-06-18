export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const GET: APIRoute = async ({ url }) => {
    const code = url.searchParams.get("code");

    if (!code) {
        return new Response("Missing code parameter", { status: 400 });
    }

    const clientId = env.GITHUB_CLIENT_ID;
    const clientSecret = env.GITHUB_CLIENT_SECRET;

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
        }),
    });

    const data = (await tokenRes.json()) as { access_token?: string; error?: string };

    if (data.error || !data.access_token) {
        return new Response(`OAuth error: ${data.error}`, { status: 401 });
    }

    const content = `
        <script>
            (function() {
                function receiveMessage(e) {
                    console.log("receiveMessage %o", e);
                    window.opener.postMessage(
                        'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: "github" })}',
                        e.origin
                    );
                    window.removeEventListener("message", receiveMessage, false);
                }
                window.addEventListener("message", receiveMessage, false);
                window.opener.postMessage("authorizing:github", "*");
            })();
        </script>
    `;

    return new Response(content, {
        headers: { "Content-Type": "text/html" },
    });
};
