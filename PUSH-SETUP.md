# Turn on the daily notifications (about 10 minutes, one time)

What you're setting up: at **6:00 AM** and **6:30 PM Mauritius time** a small function on your Vercel site sends Asnath's phone a note ("171 days left, Asnath...").

## 1. Put the new files on GitHub
New files: `sw.js`, `api/` (4 files), `package.json`, `package-lock.json`, `scripts/`, `.gitignore`, plus changes to `index.html` and `extras.js`.
`.env.local` holds your secret keys and is ignored by git. Never upload it.

```
git add -A
git commit -m "Add daily push notifications"
git push
```

## 2. Add free storage (remembers her phone)
Vercel dashboard > your project > **Storage** > **Create / Connect** > **Upstash Redis** (free plan) > connect it to this project.
That adds two variables by itself (`KV_REST_API_URL` and `KV_REST_API_TOKEN`).

## 3. Add the secret keys
Vercel > your project > **Settings** > **Environment Variables**. Copy these three values from the file `.env.local` in this folder:

| Name | Where it comes from |
|---|---|
| `VAPID_PUBLIC_KEY` | `.env.local` |
| `VAPID_PRIVATE_KEY` | `.env.local` (keep secret) |
| `CRON_SECRET` | `.env.local` (keep secret) |

Then **Redeploy** the project (Deployments > latest > Redeploy), so it picks them up.

## 4. Set the 6:00 AM and 6:30 PM timer (free)
Vercel's own free timer is only accurate to within an hour, so use a free outside timer such as **cron-job.org**:

1. Make a free account, then **Create cronjob**.
2. Job 1: URL `https://asnath-countdown.vercel.app/api/send?slot=am&key=YOUR_CRON_SECRET`, schedule **every day at 06:00**, timezone **Indian/Mauritius**.
3. Job 2: the same URL but `slot=pm`, **every day at 18:30**, timezone **Indian/Mauritius**.

(If a timer only offers UTC: Mauritius is UTC+4 all year, so use **02:00** and **14:30** UTC.)

## 5. Test it
Open this in a browser: `https://asnath-countdown.vercel.app/api/send?slot=am&key=YOUR_CRON_SECRET&test=1`
You should see `{"sent":1,...}` and her phone gets a notification (once she has signed up, step 6).

## 6. On Asnath's iPhone (needs iOS 16.4 or newer)
1. Open the site in **Safari**.
2. Tap the **+** button at the top (or Share > **Add to Home Screen**) > **Add**.
3. Open the new icon from her **Home Screen** (not from Safari).
4. Tap the **bell** > **Turn on** > **Allow**. She gets a "Daily notes are on" hello right away.

iPhones only allow web notifications from the Home Screen app, so step 3 matters.

## Good to know
- Nothing is sent before 9 Nov 2026 or after the end date; on the last morning she gets the "final day" line.
- If her phone stops accepting notifications (she removes the app), it is cleaned out automatically.
- The changing lines live in `extras.js`. After editing them, push to GitHub and redeploy.
- Lost `.env.local`? Run `node scripts/make-keys.js` again, update the three Vercel variables, and she taps the bell > Turn on once more.
- "Use Calendar instead" in the sheet still works as a backup that needs no setup.
