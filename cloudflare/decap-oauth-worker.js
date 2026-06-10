function randomHex(bytes) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function callbackScriptResponse(status, token) {
  const message = `authorization:github:${status}:${JSON.stringify({ token })}`;
  const html = [
    "<!doctype html>",
    "<html>",
    "<head>",
    '  <meta charset="utf-8">',
    "  <title>Authorizing Decap</title>",
    "</head>",
    "<body>",
    "  <p>Authorizing Decap...</p>",
    "  <script>",
    "    const receiveMessage = () => {",
    `      window.opener.postMessage(${JSON.stringify(message)}, "*");`,
    '      window.removeEventListener("message", receiveMessage, false);',
    "    };",
    '    window.addEventListener("message", receiveMessage, false);',
    '    window.opener.postMessage("authorizing:github", "*");',
    "  </script>",
    "</body>",
    "</html>",
  ].join("\n");

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function handleAuth(url, env) {
  const provider = url.searchParams.get("provider");
  if (provider !== "github") {
    return new Response("Invalid provider", { status: 400 });
  }

  const repoIsPrivate = env.GITHUB_REPO_PRIVATE && env.GITHUB_REPO_PRIVATE !== "0";
  const scope = repoIsPrivate ? "repo,user" : "public_repo,user";
  const redirectUri = `${url.origin}/callback?provider=github`;
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.GITHUB_OAUTH_ID);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", scope);
  authorize.searchParams.set("state", randomHex(4));

  return Response.redirect(authorize.toString(), 302);
}

async function handleCallback(url, env) {
  const provider = url.searchParams.get("provider");
  if (provider !== "github") {
    return new Response("Invalid provider", { status: 400 });
  }

  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const redirectUri = `${url.origin}/callback?provider=github`;
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "jeonseonghu-decap-oauth-worker",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_ID,
      client_secret: env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    return new Response("GitHub token exchange failed", { status: 502 });
  }

  const payload = await response.json();
  if (!payload.access_token) {
    return jsonResponse({ error: "No access token returned", details: payload }, 502);
  }

  return callbackScriptResponse("success", payload.access_token);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      return handleAuth(url, env);
    }

    if (url.pathname === "/callback") {
      return handleCallback(url, env);
    }

    return new Response("Decap GitHub OAuth proxy is running.", {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
};
