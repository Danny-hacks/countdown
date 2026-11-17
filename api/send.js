/* Sends today's note to every signed-up phone. A scheduler calls this at 6:00 AM and 6:30 PM her time:
     /api/send?slot=am&key=YOUR_CRON_SECRET     /api/send?slot=pm&key=YOUR_CRON_SECRET
   Add &test=1 to send a test note right now, any day. */
const { kv, webpushReady, cfg } = require("./_lib.js");
const X = require("../extras.js");

module.exports = async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const given = (req.query && req.query.key) || (req.headers.authorization || "").replace(/^Bearer /, "");
  if (!secret || given !== secret) { res.status(401).json({ error: "unauthorized" }); return; }

  try {
    const slot = req.query && req.query.slot === "pm" ? "pm" : "am";
    const c = cfg();
    let msg = X.pushMessage(c, slot, Date.now(), c.tz);
    const test = req.query && req.query.test;
    if (!msg && !test) { res.status(200).json({ sent: 0, note: "outside the internship dates" }); return; }
    if (!msg) msg = { title: "Test note", body: "If you can read this, the daily notes work." };

    const webpush = webpushReady();
    const subs = (await kv(["SMEMBERS", "subs"])) || [];
    const payload = JSON.stringify({ title: msg.title, body: msg.body, tag: "daily-" + slot });
    let sent = 0, removed = 0, failed = 0;

    await Promise.all(subs.map(async raw => {
      try {
        await webpush.sendNotification(JSON.parse(raw), payload, { TTL: 6 * 3600, urgency: "normal" });
        sent++;
      } catch (e) {
        if (e && (e.statusCode === 404 || e.statusCode === 410)) { await kv(["SREM", "subs", raw]); removed++; }   // phone unsubscribed
        else failed++;
      }
    }));
    res.status(200).json({ slot, sent, removed, failed, preview: msg.body });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
