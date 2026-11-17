/* Saves a phone's push sign-up, then sends it a hello so she knows it worked. */
const { kv, webpushReady, cfg } = require("./_lib.js");

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  try {
    const sub = req.body && typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    const ok = sub && typeof sub.endpoint === "string" && /^https:\/\//.test(sub.endpoint) && sub.endpoint.length < 800 &&
      sub.keys && typeof sub.keys.p256dh === "string" && typeof sub.keys.auth === "string" &&
      sub.keys.p256dh.length < 200 && sub.keys.auth.length < 100;
    if (!ok) { res.status(400).json({ error: "bad subscription" }); return; }

    const clean = JSON.stringify({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } });
    // One person uses this. Cap the list so a stranger can't fill it up.
    const isNew = await kv(["SISMEMBER", "subs", clean]);
    if (!isNew && Number(await kv(["SCARD", "subs"])) >= 10) { res.status(429).json({ error: "too many devices" }); return; }
    await kv(["SADD", "subs", clean]);

    // Welcome note (a failure here does not undo the sign-up).
    let welcomed = false;
    try {
      const webpush = webpushReady(), c = cfg();
      await webpush.sendNotification(JSON.parse(clean), JSON.stringify({
        title: "Daily notes are on", body: "Hi " + c.name + "! A little note every morning and evening, starting now.", tag: "welcome"
      }), { TTL: 600 });
      welcomed = true;
    } catch (_) {}
    res.status(200).json({ ok: true, welcomed });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
