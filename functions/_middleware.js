/**
 * Server-side Basic authentication for a Cloudflare Pages PREVIEW deployment.
 *
 * Never merge into production main. The browser never receives the credential,
 * and the expected SHA-256 hash is held in the Pages PREVIEW environment
 * secret named PREVIEW_GATE_PASSWORD_SHA256.
 *
 * Scope: every preview asset/path via root middleware and _routes.json.
 * If the secret is absent/malformed, fail CLOSED (503), not publicly open.
 */
const PREVIEW_DOMAIN = /^(?:[a-z0-9-]+)\.sudip-das-frontend\.pages\.dev$/i;
const HEX_SHA256 = /^[a-f0-9]{64}$/;

function response(status, body, headers = {}) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}
function credentialFrom(request) {
  const header = request.headers.get("Authorization") || "";
  if (!/^Basic [A-Za-z0-9+/]+=*$/.test(header) || header.length > 1024) return null;
  try {
    const raw = atob(header.slice(6));
    const separator = raw.indexOf(":");
    if (separator < 0) return null;
    const username = raw.slice(0, separator);
    const password = raw.slice(separator + 1);
    if (username !== "owner" || password.length < 16 || password.length > 256) return null;
    return password;
  } catch {
    return null;
  }
}
async function passwordMatches(password, expectedHex) {
  const bytes = new TextEncoder().encode(password);
  const result = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const expected = expectedHex.match(/../g).map(part => Number.parseInt(part, 16));
  let diff = 0;
  for (let i = 0; i < 32; i++) diff |= result[i] ^ expected[i];
  return diff === 0;
}
export async function onRequest({ request, env, next }) {
  const hostname = new URL(request.url).hostname;
  // This branch should only ever be deployed as a preview. Do not allow a
  // permissive bypass if someone accidentally deploys it on production.
  if (!PREVIEW_DOMAIN.test(hostname)) {
    return response(503, "Preview protection: invalid deployment hostname.");
  }
  const secret = String(env?.PREVIEW_GATE_PASSWORD_SHA256 ?? "").trim();
  if (!HEX_SHA256.test(secret)) {
    return response(503, "Preview temporarily unavailable: protection is not configured.");
  }
  const password = credentialFrom(request);
  if (!password || !(await passwordMatches(password, secret))) {
    return response(401, "Authentication required for the personal website preview.", {
      "WWW-Authenticate": 'Basic realm="Personal website preview", charset="UTF-8"',
    });
  }
  const upstream = await next();
  const headers = new Headers(upstream.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Authorization");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
}
