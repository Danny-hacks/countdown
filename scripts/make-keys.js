/* Makes the secret keys the notifications need, and saves them to .env.local (which git ignores).
   Run once:  node scripts/make-keys.js     Then copy the values into Vercel > Settings > Environment Variables. */
const crypto = require("crypto"), fs = require("fs"), path = require("path");
const out = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(out)) { console.log(".env.local already exists. Delete it first if you really want new keys (old phones would need to sign up again)."); process.exit(0); }

const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const pub = publicKey.export({ format: "jwk" }), priv = privateKey.export({ format: "jwk" });
const b64 = s => Buffer.from(s, "base64url");
const publicKeyB64 = Buffer.concat([Buffer.from([4]), b64(pub.x), b64(pub.y)]).toString("base64url");   // uncompressed P-256 point
const privateKeyB64 = priv.d;
const cron = crypto.randomBytes(24).toString("base64url");

fs.writeFileSync(out, [
  "VAPID_PUBLIC_KEY=" + publicKeyB64,
  "VAPID_PRIVATE_KEY=" + privateKeyB64,
  "CRON_SECRET=" + cron,
  "# Optional (defaults are already right for Asnath, Mauritius):",
  "# TZ_OFFSET=4",
  "# VAPID_SUBJECT=https://asnath-countdown.vercel.app",
  ""
].join("\n"));
console.log("Saved to .env.local. Open that file and copy the three values into Vercel.");
console.log("Public key (safe to share):", publicKeyB64);
