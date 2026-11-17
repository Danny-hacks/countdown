// Asnath's sunset countdown widget (for the Scriptable app).
// Scriptable > + > paste this > name it > then add a Scriptable widget to your Home Screen and choose this script.
const NAME = "Asnath";
const START = "2026-11-09";
const MONTHS = 6;
const QUOTES = [
 "You're not just surviving this internship. You're the main character.",
 "Coffee: powered. Confidence: loading. Let's go.",
 "Every email you send is a tiny step toward legend status.",
 "Be the intern they write recommendation letters about.",
 "You didn't come this far just to come this far.",
 "Plot twist: you're the reason the team looks good.",
 "Today's forecast: 100% chance of you crushing it.",
 "If it scares you, it's probably a promotion in disguise.",
 "The printer may jam, but you won't.",
 "Somewhere, a future boss is already impressed.",
 "Your future self is doing a happy dance right now.",
 "Be so good they have to hire you. Or at least give you a mug.",
 "Teamwork makes the dream work, and you make the team shine.",
 "Make today so good that tomorrow gets jealous.",
 "Spreadsheets fear you.",
 "Do it with style. Do it with snacks. Just do it.",
 "Believe in yourself. The WiFi might not, but you should.",
 "Be the sunshine in the Monday meeting.",
 "{months} left. Sucks to be you. (I'm very proud of you though.)",
 "{days} to go. Imagine being you right now.",
 "Only {days} left. That's a lot of Mondays, {name}.",
 "{months} left. Good luck. We're all rooting for you. From very far away.",
 "{days} left. Statistically, that's a lot of coffee.",
 "{days} to go. Don't look at the number. Look at the sunset.",
 "{months} to go. Hope you like that desk.",
 "Breaking news: {months} remain. Experts say: sucks to be you.",
 "{days} left. The printer knows. The printer always knows.",
 "Plot twist: {months} left and you still have to look happy about it.",
 "Only {days}. It builds character. Allegedly.",
 "{name}, you have {months} left. Hydrate.",
 "{days} to go. It's a marathon, not a sprint. Sorry.",
 "{months} left. Look on the bright side: snacks. Maybe.",
 "Roses are red, violets are blue, {days} left, and sucks to be you.",
 "Every day you survive is one less of {days}. Math is fun.",
 "Tiny reminder: {days} left. Tiny reminder: you're doing great.",
 "Warning: {days} remaining. Keep your emotional support coffee close.",
 "If {days} feels long, wait till the meeting that could have been an email.",
 "{months} left? Sucks to be you. Kidding. Mostly.",
 "{days} to go, {name}. At least the sunsets are free."
];
const [y, m, d] = START.split('-').map(Number);
const end = new Date(y, m - 1 + MONTHS, d);
const now = new Date();
const rem = Math.max(0, end - now);
const days = Math.floor(rem / 864e5);
const hours = Math.floor(rem / 36e5) % 24;
const mo = Math.max(1, Math.round(days / 30.4));
const pl = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
const fill = s => s.replace(/\{days\}/g, pl(days, 'day')).replace(/\{months\}/g, pl(mo, 'month')).replace(/\{name\}/g, NAME);
const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 864e5);
const quote = fill(QUOTES[doy % QUOTES.length]);
const fam = config.widgetFamily || 'medium';
const w = new ListWidget();
const g = new LinearGradient();
g.colors = [new Color('#0b0908'), new Color('#33194a'), new Color('#c2492b'), new Color('#ff9a4d')];
g.locations = [0, 0.45, 0.82, 1];
w.backgroundGradient = g;
if (fam.startsWith('accessory')) {
  const t = w.addText(days + ' days to go');
  t.font = Font.boldSystemFont(14);
} else {
  w.setPadding(16, 16, 16, 16);
  const who = w.addText(NAME.toUpperCase());
  who.font = Font.mediumMonospacedSystemFont(10);
  who.textColor = new Color('#f0e9de', 0.75);
  w.addSpacer();
  const num = w.addText(String(days));
  num.font = Font.regularSystemFont(fam === 'small' ? 56 : 64);
  num.textColor = Color.white();
  num.minimumScaleFactor = 0.5;
  const lbl = w.addText('DAYS TO GO  -  ' + hours + 'H');
  lbl.font = Font.mediumMonospacedSystemFont(9);
  lbl.textColor = new Color('#ffd9b0');
  if (fam !== 'small') {
    w.addSpacer(8);
    const q = w.addText(quote);
    q.font = Font.mediumSystemFont(13);
    q.textColor = new Color('#fff6ec', 0.95);
    q.lineLimit = 3;
  }
}
w.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);
if (config.runsInWidget) { Script.setWidget(w); } else { await w.presentMedium(); }
Script.complete();
