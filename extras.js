/* Shared by index.html (browser), the notification functions in api/ and build.js (node).
   Lines, the daily-reminders calendar (.ics) and the iPhone widget script (Scriptable).
   Tokens: {name}  {days} -> "172 days" / "1 day"  {months} -> "6 months" / "1 month"  {d} (plain number)
   Tone: warm, a bit cheeky, and aware that her internship is far away (5 AM starts, an hour each way). */
(function (root) {
  "use strict";

  /* Shown on the page: a fresh one with every picture. */
  const QUOTES = [
    /* the long commute, with love */
    "5 AM alarm. One hour each way. And you still show up. Legend behavior. 🫡",
    "Up before the sun, home after it. {days} to go. 🌅",
    "Two hours on the road every day. That's a whole podcast season. Hang in there. 🎧",
    "One hour there, one hour back. Sucks to be you. Respect, though.",
    "{days} left. Then no more 5 AM. Just hold on. ⏰",
    "Future you will never take that road again. 🚌✨",
    "Every sunrise on the way to work is a free show. {days} left. 🌄",
    "{name}, you're basically a long-distance intern. Respect.",
    "Almost free: {months} left, then goodbye commute. 👋",
    "{days} to go. Counting them like they owe you money. 😤",
    "The finish line doesn't have a commute. 🏁",
    "Wake up at 5, nap on the bus, conquer the day. Repeat. 😴",
    "Sucks to be you: 5 AM wake-ups. Good to be you: {months} from freedom.",
    "Traffic is temporary. Your resume is forever. 📄",
    "Imagine waking up at 5 AM for this. Oh wait, that's you. {days} left. 😅",
    "{days} left. The road knows your name by now.",
    "Gold star for another 5 AM. ⭐ {days} to go.",
    "{months} left, {name}. Hold on a little longer. You're nearly out. 🚪",
    "A long way to work, but a short way to the end. {days} left.",
    "Somewhere out there is a day with no alarm at 5. It's {days} away. 🛋️",
    /* cheesy cheers */
    "You're not just surviving this internship. You're the main character. ✨",
    "Coffee: powered. Confidence: loading. Let's go. ☕",
    "Be the intern they write recommendation letters about.",
    "Plot twist: you're the reason the team looks good.",
    "Somewhere, a future boss is already impressed.",
    "Make today so good that tomorrow gets jealous.",
    "Spreadsheets fear you.",
    "Be the sunshine in the Monday meeting. ☀️",
    /* friendly roasts about the long haul */
    "{months} left. Sucks to be you. (I'm very proud of you though.)",
    "{days} to go. Imagine being you right now. 😬",
    "Only {days} left. That's a lot of Mondays, {name}.",
    "{months} left. Good luck. We're all rooting for you. From very far away. 📣",
    "{days} left. Statistically, that's a lot of coffee. ☕",
    "{days} to go. Don't look at the number. Look at the sunset.",
    "Breaking news: {months} remain. Experts say: sucks to be you. 📰",
    "{days} left. The printer knows. The printer always knows. 🖨️",
    "Plot twist: {months} left and you still have to look happy about it.",
    "{name}, you have {months} left. Hydrate. 💧",
    "Roses are red, violets are blue, {days} left, and sucks to be you. 🌹",
    "Warning: {days} remaining. Keep your emotional support coffee close.",
    "{days} to go, {name}. At least the sunsets are free. 🌇"
  ];

  /* Reminder captions (calendar + push). 6:00 AM: she's probably on the road. 6:30 PM: heading home or just in. */
  const MORNING = [
    "Up at 5 AM again? Legend. {d} days to go. ☕",
    "Good morning, {name}. {d} days left. Podcast loaded? 🎧",
    "{d} days to go. Today's commute is powered by pure willpower. 💪",
    "On the road already? {d} days left. Almost free, {name}. 🚌",
    "The sun isn't even up and you are. Respect. {d} days to go. 🌅",
    "{d} days left. Forehead on the window is allowed. You've got this.",
    "Rise and commute, {name}! {d} days to go.",
    "Another early start. Sucks to be you. {d} days left. You're doing amazing. ✨",
    "Good morning! {d} days left. One hour there, one hour back. You're built different. 😤",
    "{d} days to go. Every early alarm is one fewer. Keep going.",
    "Morning, superstar. {d} days left. Nap on the bus, no one's judging. 😴",
    "It's early. It's far. You're still showing up. {d} days to go. 🫡",
    "{d} days left, {name}. The finish line has no commute. 🏁",
    "Good morning. {d} days left. Think of the sleep-ins ahead. 🛌",
    "Rise, sparkle, intern. {d} days left.",
    "Your coffee called. It says you've got this. {d} days to go. ☕",
    "{d} days left. Snack in the bag? Playlist on? Go. 🎶",
    "Hey {name}, you're doing better than you think. {d} days left.",
    "Chin up, {name}. The view gets better at sunset. {d} days to go. 🌇",
    "Good morning! {d} days left to turn 'intern' into 'irreplaceable'.",
    "Another sunrise from the road. Free show. {d} days left. 🌄",
    "{d} days to go. Be the energy you want in the meeting.",
    "Early bird energy, {name}. {d} days left. The worm can wait. 🐛",
    "{d} days left. Sucks to be you, but also, you've totally got this.",
    "Good morning, {name}. {d} days to go. The coffee is on your side. ☕",
    "Take a breath, take a sip, take on the day. {d} days to go.",
    "{d} days left. Put on your brave pants and your good shoes. 👟",
    "You're one day closer to the finish line. {d} days left. Go get it.",
    "Today's agenda: survive, thrive, snack. {d} days left, {name}.",
    "{d} days to go. If it were easy, it wouldn't be this far. 😅",
    "Morning! {d} days left. Imagine the lie-in waiting for you. 🥱",
    "The road is long. You are longer. {d} days to go. 💫",
    "{d} days left. Your future self thanks you for every early start.",
    "Hang in there, {name}. {d} days to go. Almost out of the 5 AM club. ⏰",
    "{d} days left. One foot in front of the other, one stop at a time. 🚏",
    "Good morning! {d} days to go. Sunrise first, stress later. 🌅",
    "{d} days left. Be kind to yourself on the way in. 🤍",
    "{d} days to go, {name}. You make that commute look easy.",
    "Early start, big heart. {d} days left. Go be great. ✨"
  ];
  const EVENING = [
    "Commute home done? Great. {d} days to go. Couch time. 🛋️",
    "Home soon, {name}. {d} days left. You earned dinner. 🍽️",
    "One hour back home and you survived another day. {d} days to go. 🌇",
    "The sun's setting on today and you absolutely shone. {d} days left.",
    "Log off, breathe out. {d} days to go, zero doubts.",
    "{d} days left. Be proud of today. Then eat something delicious.",
    "Another day survived, and thrived. {d} days to go, {name}. 🎉",
    "Close the laptop, open the snacks. {d} days left. 🍿",
    "You did good today, {name}. {d} days to go. Rest up. 😌",
    "Sunset time. {d} days left. Today's wins go in the trophy cabinet. 🏆",
    "{d} days to go. The inbox can wait. You've done enough today.",
    "Good evening, legend. {d} days left. Tomorrow needs you well rested.",
    "Kick off the work shoes. {d} days left, {name}. 👟",
    "{d} days left. Whatever happened today, you showed up. That's the win.",
    "Evening, superstar. {d} days to go. Treat yourself. You deserve it.",
    "{d} days to go. Be gentle with yourself tonight. 🤍",
    "The day is done and so is the hard part. {d} days left, {name}.",
    "Sunset check: still amazing. {d} days to go. 🌅",
    "Wrap it up, wind down, glow on. {d} days to go.",
    "Another sunset, another small victory. {d} days left.",
    "{d} days to go. Dinner, music, zero emails. Doctor's orders.",
    "You turned a long day into a good one, {name}. {d} days left.",
    "Stars are coming out, {name}. So are your best days. {d} days left. ✨",
    "One more day in the bank. {d} days to go. You're doing so well.",
    "{d} days left, {name}. Eat dinner. Ignore Slack. Sleep. 😴",
    "One day down, {d} days to go. Sucks to be you. Kidding. Go rest.",
    "{d} days left. Tonight's plan: horizontal. Tomorrow: iconic.",
    "You made it through today, and through the commute twice. {d} days to go. 🚌",
    "Long way home, short way to the finish. {d} days left. 🏁",
    "{d} days left, {name}. Alarm set for tomorrow? Sorry. You're a hero. ⏰",
    "Home, shoes off, phone down. {d} days to go. You did that.",
    "Sunset! {d} days to go. Sucks to be you, but wow, you look good doing it.",
    "{d} days left. If today was a lot, tomorrow's a fresh start. 🌱",
    "The commute is behind you, {name}. {d} days to go. Breathe. 🌬️",
    "{d} days left. Tonight, go to bed early. Future you says thanks. 🛌",
    "A big thank-you to your 5 AM self. {d} days to go. 🫶",
    "Good evening. {d} days left. You're closer to free than you were this morning. 🕊️",
    "{d} days to go, {name}. Warm food, soft blanket, zero guilt. 🧣",
    "Another one done. {d} days left. Proud of you. 💛"
  ];
  const FINAL_AM = "Final day, {name}! The sun sets on this chapter today. Last commute. Make it a good one. 🌅";
  const FINAL_PM = "You did it, {name}! Every single 5 AM. Go celebrate. You earned it. 🎉";

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
  /* RFC 5545: lines <= 75 octets. Counts UTF-8 bytes and never splits an emoji. */
  function fold(line) {
    const enc = new TextEncoder(), out = [], limit = 70;
    let cur = "", n = 0;
    for (const ch of line) {
      const b = enc.encode(ch).length;
      if (n + b > limit) { out.push(cur); cur = " " + ch; n = 1 + b; } else { cur += ch; n += b; }
    }
    out.push(cur);
    return out.join("\r\n");
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

  /* The line for a real push notification sent at "now". tz = hours ahead of UTC for her
     timezone (Mauritius is UTC+4, no daylight saving). slot = "am" | "pm".
     Matches the calendar captions, so both routes say the same thing on the same day. */
  function pushMessage(cfg, slot, nowMs, tz) {
    tz = (tz == null ? 4 : tz);
    const [y, m, d] = cfg.start.split("-").map(Number);
    const startL = Date.UTC(y, m - 1, d);                          // local midnight on her clock
    const endL = Date.UTC(y, m - 1 + Number(cfg.months), d);
    const nowL = nowMs + tz * 3600e3;
    const i = Math.round((Math.floor(nowL / DAY) * DAY - startL) / DAY);
    const left = Math.floor((endL - nowL) / DAY);
    if (i < 0 || left < 0) return null;                            // before the start or after the end
    const am = slot === "am";
    const arr = am ? MORNING : EVENING;
    const text = fill(left === 0 ? (am ? FINAL_AM : FINAL_PM) : arr[(i + (am ? 0 : 7)) % arr.length], { name: cfg.name, d: left });
    return { title: (am ? "Good morning, " : "Good evening, ") + cfg.name, body: text, left: left };
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

  const api = { QUOTES, MORNING, EVENING, fill, buildICS, buildWidgetScript, pushMessage };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Extras = api;
})(typeof window !== "undefined" ? window : globalThis);
