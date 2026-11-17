// Regenerates the shareable files in ./downloads from the settings below.
// Usage: node build.js   (edit CONFIG to match DEFAULTS in index.html)
const fs = require("fs"), path = require("path");
const X = require("./extras.js");
const CONFIG = { name: "Asnath", start: "2026-11-09", months: 6 };
const out = path.join(__dirname, "downloads"); fs.mkdirSync(out, { recursive: true });
const ics = X.buildICS(CONFIG);
fs.writeFileSync(path.join(out, CONFIG.name.toLowerCase() + "-reminders.ics"), ics);
fs.writeFileSync(path.join(out, CONFIG.name.toLowerCase() + "-widget.js"), X.buildWidgetScript(CONFIG));
console.log("events:", (ics.match(/BEGIN:VEVENT/g) || []).length);
