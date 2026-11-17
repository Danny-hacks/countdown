/* Gives the page the public push key (safe to share; the private key stays on the server). */
module.exports = (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) { res.status(503).json({ error: "push not configured" }); return; }
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).json({ publicKey });
};
