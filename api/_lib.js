/* Shared helpers for the notification functions. (Files starting with _ are not public routes.) */

// Her countdown. Defaults match index.html; override with environment variables if they change.
const cfg = () => ({
  name: process.env.COUNTDOWN_NAME || "Asnath",
  start: process.env.COUNTDOWN_START || "2026-11-09",
  months: Number(process.env.COUNTDOWN_MONTHS || 6),
  tz: Number(process.env.TZ_OFFSET || 4)            // hours ahead of UTC. Mauritius = 4, no daylight saving.
});

// Tiny Redis client over HTTP (Upstash). Works with the names Vercel's Upstash integration sets.
async function kv(command) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("storage not configured");
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify(command)
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

function webpushReady() {
  const webpush = require("web-push");
  const pub = process.env.VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) throw new Error("push keys not configured");
  // The "subject" only needs to identify the site; no personal email needed.
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "https://asnath-countdown.vercel.app", pub, priv);
  return webpush;
}

module.exports = { cfg, kv, webpushReady };
