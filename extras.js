/* Shared by index.html (browser) and build.js (node).
   Lines, the daily-reminders calendar (.ics) and the iPhone widget script (Scriptable).
   Tokens: {name}  {days} -> "172 days" / "1 day"  {months} -> "6 months" / "1 month"  {d} (plain number) */
(function (root) {
  "use strict";

  /* Shown on the page: a fresh one every picture. Cheesy cheers and friendly jokes about the long haul. */
  const QUOTES = [
    /* cheesy cheers */
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
    /* friendly roasts about the long haul */
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

  /* Reminder captions for the calendar. Keep plain ASCII. */
  const MORNING = [
    "Rise and shine, {name}! {d} days to go. Be the intern they never forget.",
    "{d} days left. Coffee first, world domination second.",
    "Good morning! Only {d} sunrises left in this internship. Make this one count.",
    "Another day, another chance to be the best thing that happened to that office. {d} to go.",
    "Wake up, {name}. The sun is up and so is your potential. {d} days left.",
    "{d} days to go. Today's mission: be brilliant, be kind, be on time-ish.",
    "Morning, superstar. {d} days left, and every one of them is an opportunity.",
    "Long internship? Long list of wins. {d} days left. Go collect today's.",
    "Plot twist: you're better at this than you think. {d} days to go.",
    "It's a great day to be a legend. {d} days left, {name}.",
    "Fuel up and glow up. {d} days left on this adventure.",
    "{d} days to go. Smile, send the emails, steal the show.",
    "Good morning, {name}! The hours are long but the sunsets are longer. {d} days left.",
    "New day, new chance to impress someone. {d} days to go.",
    "Rise, sparkle, intern. {d} days left.",
    "Your coffee called. It says you've got this. {d} days to go.",
    "Eyes on the prize, {name}. {d} days left until sunset.",
    "{d} days to go. Be the energy you want in the meeting.",
    "Today is a good day to be unstoppable. {d} days left.",
    "Good morning! {d} days left to turn 'intern' into 'irreplaceable'.",
    "The early intern gets the good parking spot. {d} days to go.",
    "Hey {name}, you're doing better than you think. {d} days left.",
    "{d} days to go. Make Future You proud before lunch.",
    "Another sunrise, another step closer to greatness. {d} days left.",
    "Take a breath, take a sip, take on the day. {d} days to go.",
    "{d} days left. Ask questions, take notes, take over the world.",
    "Good morning, {name}! Believe in yourself. The coffee already does. {d} days to go.",
    "You're one day closer to the finish line. {d} days left. Go get it.",
    "Chin up, {name}. The view gets better at sunset. {d} days to go.",
    "{d} days left. Show up, shine on.",
    "Good morning. {d} days left. Sucks to be you. Go be great anyway.",
    "Rise and grind, {name}. {d} days to go. Yes, still that many.",
    "{d} days left. The alarm is cruel but you are cruel-proof.",
    "Morning! {d} days to go. Nobody said building a career would be glamorous.",
    "{d} days left. Sucks to be you, but also, you've totally got this.",
    "Good morning, {name}. {d} days to go. The coffee is on your side.",
    "{d} days left. Put on your brave pants and your good shoes.",
    "Today's agenda: survive, thrive, snack. {d} days left, {name}.",
    "{d} days to go. If it were easy, it wouldn't be this long."
  ];
  const EVENING = [
    "Day done! {d} days to go. You earned that couch, {name}.",
    "The sun's setting on today and you absolutely shone. {d} days left.",
    "Log off, breathe out. {d} days to go, zero doubts.",
    "{d} days left. Be proud of today. Then eat something delicious.",
    "Another day survived, and thrived. {d} days to go, {name}.",
    "Close the laptop, open the snacks. {d} days left.",
    "You did good today, {name}. {d} days to go. Rest up.",
    "Sunset time. {d} days left. Today's wins go in the trophy cabinet.",
    "{d} days to go. The inbox can wait. You've done enough today.",
    "Good evening, legend. {d} days left. Tomorrow needs you well rested.",
    "Another page turned. {d} days to go. Hot take: you're doing great.",
    "Kick off the work shoes. {d} days left, {name}.",
    "{d} days left. Whatever happened today, you showed up. That's the win.",
    "Evening, superstar. {d} days to go. Treat yourself. You deserve it.",
    "Today's chapter is closed, and it was a good one. {d} days left.",
    "{d} days to go. Be gentle with yourself tonight.",
    "The day is done and so is the hard part. {d} days left, {name}.",
    "Sunset check: still amazing. {d} days to go.",
    "You've got {d} days left and a whole evening to enjoy. Go.",
    "Hey {name}, proud of you. {d} days to go. Sleep well tonight.",
    "{d} days left. The best interns rest well. That's you.",
    "Wrap it up, wind down, glow on. {d} days to go.",
    "Another sunset, another small victory. {d} days left.",
    "{d} days to go. Dinner, music, zero emails. Doctor's orders.",
    "You turned a long day into a good one, {name}. {d} days left.",
    "Day complete. Achievement unlocked. {d} days to go.",
    "Tonight's agenda: nothing. You've earned it. {d} days left.",
    "{d} days to go. Tomorrow's a new chance to be great. Tonight, rest.",
    "Stars are coming out, {name}. So are your best days. {d} days left.",
    "{d} days left. One more sunset down. You make it look easy.",
    "One day down, {d} days to go. Sucks to be you. Kidding. Go rest.",
    "{d} days left, {name}. You survived another one. Be smug about it.",
    "Evening! {d} days to go. Still not over. But look how far you've come.",
    "{d} days left. Tonight's plan: horizontal. Tomorrow: iconic.",
    "You made it through today. {d} days to go. The couch is proud of you.",
    "{d} days left. If today was a lot, tomorrow's a fresh start.",
    "Sunset! {d} days to go. Sucks to be you, but wow, you look good doing it.",
    "{d} days left, {name}. Eat dinner. Ignore Slack. Sleep.",
    "One more day in the bank. {d} days to go. You're doing so well."
  ];
  const FINAL_AM = "Final day, {name}. The sun sets on this chapter today. Make it a good one.";
  const FINAL_PM = "You did it, {name}. Every single day. Go celebrate. You earned it.";

  const DAY = 864e5;
  const pad = n => String(n).padStart(2, "0");
  const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");

  /* Fill the tokens. d = whole days left. */
  function fill(s, o) {
    const d = o.d, mo = Math.max(1, Math.round(d / 30.4));
    return s
      .replace(/\{days\}/g, plural(d, "day"))
      .replace(/\{months\}/g, plural(mo, "month"))
      .replace(/\{d\} days/g, plural(d, "day"))
      .replace(/\{name\}/g, o.name)
      .replace(/\{d\}/g, d);
  }

  function dates(cfg) {
    const [y, m, d] = cfg.start.split("-").map(Number);
    return { start: new Date(y, m - 1, d, 0, 0, 0), end: new Date(y, m - 1 + Number(cfg.months), d, 0, 0, 0) };
  }

  function icsEscape(s) { return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n"); }
  function fold(line) {                 // RFC 5545: lines <= 75 octets (text is ASCII, so chars == octets)
    const out = []; while (line.length > 70) { out.push(line.slice(0, 70)); line = " " + line.slice(70); }
    out.push(line); return out.join("\r\n");
  }

  /* Calendar with a 6:00 AM and an evening alert for every day until the end.
     Times are "floating" (no timezone), so they fire at 6am wherever the phone is. */
  function buildICS(cfg, opts) {
    opts = opts || {};
    const am = opts.morning || "06:00", pm = opts.evening || "18:30";
    const { start, end } = dates(cfg);
    const from = opts.from ? new Date(opts.from) : new Date();
    from.setHours(0, 0, 0, 0);
    const first = from > start ? from : start;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sunset Countdown//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "X-WR-CALNAME:" + icsEscape(cfg.name + "'s Sunset Countdown")];
    let i = Math.round((first - start) / DAY);
    for (let day = new Date(first); day < end; day.setDate(day.getDate() + 1), i++) {
      const ymd = day.getFullYear() + pad(day.getMonth() + 1) + pad(day.getDate());
      [["am", am, MORNING, 0, FINAL_AM, "Good morning"], ["pm", pm, EVENING, 7, FINAL_PM, "Good evening"]].forEach(([k, hhmm, arr, shift, fin, hi]) => {
        const [hh, mm] = hhmm.split(":").map(Number);
        const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hh, mm);
        if (at >= end) return;
        const left = Math.floor((end - at) / DAY);
        const text = fill(left === 0 ? fin : arr[(i + shift) % arr.length], { name: cfg.name, d: left });
        const hEnd = pad(hh) + pad(Math.min(59, mm + 15)) + "00";
        L.push("BEGIN:VEVENT", "UID:cd-" + ymd + "-" + k + "@sunset-countdown", "DTSTAMP:" + stamp,
          "DTSTART:" + ymd + "T" + pad(hh) + pad(mm) + "00", "DTEND:" + ymd + "T" + hEnd,
          fold("SUMMARY:" + icsEscape(text)), fold("DESCRIPTION:" + icsEscape(text)), "TRANSP:TRANSPARENT",
          "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:" + icsEscape(hi + ", " + cfg.name), "END:VALARM", "END:VEVENT");
      });
    }
    L.push("END:VCALENDAR");
    return L.join("\r\n") + "\r\n";
  }

  /* Home Screen widget for the free "Scriptable" iPhone app. */
  function buildWidgetScript(cfg) {
    return [
      "// " + cfg.name + "'s sunset countdown widget (for the Scriptable app).",
      "// Scriptable > + > paste this > name it > then add a Scriptable widget to your Home Screen and choose this script.",
      "const NAME = " + JSON.stringify(cfg.name) + ";",
      "const START = " + JSON.stringify(cfg.start) + ";",
      "const MONTHS = " + Number(cfg.months) + ";",
      "const QUOTES = " + JSON.stringify(QUOTES, null, 1) + ";",
      "const [y, m, d] = START.split('-').map(Number);",
      "const end = new Date(y, m - 1 + MONTHS, d);",
      "const now = new Date();",
      "const rem = Math.max(0, end - now);",
      "const days = Math.floor(rem / 864e5);",
      "const hours = Math.floor(rem / 36e5) % 24;",
      "const mo = Math.max(1, Math.round(days / 30.4));",
      "const pl = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');",
      "const fill = s => s.replace(/\\{days\\}/g, pl(days, 'day')).replace(/\\{months\\}/g, pl(mo, 'month')).replace(/\\{name\\}/g, NAME);",
      "const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 864e5);",
      "const quote = fill(QUOTES[doy % QUOTES.length]);",
      "const fam = config.widgetFamily || 'medium';",
      "const w = new ListWidget();",
      "const g = new LinearGradient();",
      "g.colors = [new Color('#0b0908'), new Color('#33194a'), new Color('#c2492b'), new Color('#ff9a4d')];",
      "g.locations = [0, 0.45, 0.82, 1];",
      "w.backgroundGradient = g;",
      "if (fam.startsWith('accessory')) {",
      "  const t = w.addText(days + ' days to go');",
      "  t.font = Font.boldSystemFont(14);",
      "} else {",
      "  w.setPadding(16, 16, 16, 16);",
      "  const who = w.addText(NAME.toUpperCase());",
      "  who.font = Font.mediumMonospacedSystemFont(10);",
      "  who.textColor = new Color('#f0e9de', 0.75);",
      "  w.addSpacer();",
      "  const num = w.addText(String(days));",
      "  num.font = Font.regularSystemFont(fam === 'small' ? 56 : 64);",
      "  num.textColor = Color.white();",
      "  num.minimumScaleFactor = 0.5;",
      "  const lbl = w.addText('DAYS TO GO  -  ' + hours + 'H');",
      "  lbl.font = Font.mediumMonospacedSystemFont(9);",
      "  lbl.textColor = new Color('#ffd9b0');",
      "  if (fam !== 'small') {",
      "    w.addSpacer(8);",
      "    const q = w.addText(quote);",
      "    q.font = Font.mediumSystemFont(13);",
      "    q.textColor = new Color('#fff6ec', 0.95);",
      "    q.lineLimit = 3;",
      "  }",
      "}",
      "w.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);",
      "if (config.runsInWidget) { Script.setWidget(w); } else { await w.presentMedium(); }",
      "Script.complete();",
      ""
    ].join("\n");
  }

  const api = { QUOTES, MORNING, EVENING, fill, buildICS, buildWidgetScript };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Extras = api;
})(typeof window !== "undefined" ? window : globalThis);
