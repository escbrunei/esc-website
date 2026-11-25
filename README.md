# Economic Students’ Chamber (ESC) Brunei — Website

The ESC website, built with React and Vite and published free on GitHub Pages.

**Pages:** Home · Brunei Economy Dashboard (with Economic News & Releases) · Economics Lab · Ask ESynC (AI assistant) · Events · The Invisible Handshake Series · About Us · Join ESC · Contact

> **Before launch:** the dashboard charts and the CPI exercise currently use **sample figures**, clearly labelled as such. Replace them with verified DEPS figures (see [Update the dashboard data](#update-the-dashboard-data)).

---

## Contents

1. [Put the site online (first time)](#1-put-the-site-online-first-time)
2. [Run the site on your computer](#2-run-the-site-on-your-computer)
3. [Committee handover guide](#3-committee-handover-guide-no-coding-needed) (events, recaps, members, terms, social links)
4. [Update the dashboard data](#update-the-dashboard-data)
5. [News & releases: add or change sources](#news--releases-add-or-change-sources)
6. [Connect the membership form](#connect-the-membership-form)
7. [ESynC: AI backend](#esync-ai-backend)
8. [Brand fonts](#brand-fonts)
9. [Testing checklist](#testing-checklist)
10. [Where things live](#where-things-live)

---

## 1. Put the site online (first time)

You need a free GitHub account.

1. On GitHub, click **+ → New repository**. Name it, for example, `esc-website`. Make it **Public** (free GitHub Pages needs a public repository). Click **Create repository**.
2. On the new repository page, click **uploading an existing file**. Drag in **everything inside** the `esc-website` folder (including the hidden `.github` folder; on a Mac press `Cmd + Shift + .` to show hidden files). Click **Commit changes**.
   - If drag-and-drop skips the `.github` folder, create it by hand: **Add file → Create new file**, type `.github/workflows/deploy.yml` as the name, paste the contents of that file, and commit.
3. Go to **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Go to the **Actions** tab. Open **Update news and deploy to GitHub Pages** and click **Run workflow** (or wait for the next save to `main`).
5. After about two minutes the site is live at `https://YOUR-USERNAME.github.io/esc-website/`. The link also appears in **Settings → Pages**.

From then on, **every change saved to the `main` branch republishes the site automatically**, and the news feed refreshes once a day.

**Custom domain (optional):** Settings → Pages → Custom domain. Follow GitHub's DNS instructions.

## 2. Run the site on your computer

Install [Node.js](https://nodejs.org) 20 or newer, then in the project folder:

```bash
npm install
npm run dev          # opens a local preview, usually at http://localhost:5173
npm run build        # production build into dist/
npm run fetch-news   # refresh public/data/news.json from the news sources
```

---

## 3. Committee handover guide (no coding needed)

Every edit below is done on github.com: open the file, click the **pencil icon (Edit)**, make the change, then click **Commit changes** and commit directly to `main`. The site updates in about two minutes (check progress in the **Actions** tab; a green tick means it is live).

> **JSON tips:** keep the quotation marks and commas exactly as in the examples. Text goes inside `"double quotes"`. Items in a list are separated by commas, with **no comma after the last item**. If the Actions run turns red after an edit, there is usually a missing or extra comma. Fix it and commit again.

### Add an event or announce a new Invisible Handshake session

File: `src/data/events.json`

Copy the `_example` block into the `events` list and fill it in. **Publish confirmed details only.**

```json
"events": [
  {
    "id": "ih-02",
    "series": "invisible-handshake",
    "title": "The Invisible Handshake Series: Session 2",
    "topic": "Careers in banking",
    "date": "2027-02-10",
    "time": "2:00 pm – 4:00 pm",
    "venue": "Bandar Seri Begawan",
    "speaker": { "name": "Speaker name", "role": "Job title", "organisation": "Organisation" },
    "summary": "One or two sentences announcing the event.",
    "recap": "",
    "photos": [],
    "postUrl": "https://www.instagram.com/p/XXXXXXXX/",
    "registrationUrl": ""
  }
]
```

- `date` uses `YYYY-MM-DD`. Events dated today or later appear under **Upcoming Events**; earlier ones move to **Past Events** automatically.
- `series`: use `"invisible-handshake"` for Invisible Handshake sessions (they then also appear on the series page and the homepage feature). Use `null` (no quotes) for other ESC activities.
- `postUrl`: link to the ESC Instagram or LinkedIn post.
- `registrationUrl`: optional sign-up link. Leave `""` if there isn't one.
- If no upcoming event is listed, the site automatically points students to @escbrunei.

### Publish a session recap

After the event, edit the same entry in `src/data/events.json`:

1. Write a short `recap`.
2. Upload photos: open `public/images/events/`, then **Add file → Upload files**. Use short names without spaces, e.g. `ih-02-1.jpg`. Keep photos under about 500 KB each (resize on your phone or use squoosh.app).
3. List them in the entry:
   ```json
   "photos": [
     { "src": "images/events/ih-02-1.jpg", "alt": "Speaker answering students' questions" }
   ],
   ```
   The `alt` text describes the photo for visitors who use screen readers.
4. Set `postUrl` to the Instagram or LinkedIn highlights post.

### Update committee members and founders

File: `src/data/members.json`

```json
{
  "currentTerm": "2026",
  "founders": [
    { "name": "Full Name", "foundingRole": "Founding President", "photo": "images/committee/full-name.jpg" }
  ],
  "committees": [
    {
      "term": "2026",
      "label": "Inaugural Committee (2026)",
      "members": [
        { "name": "Full Name", "role": "President", "photo": "images/committee/full-name.jpg" },
        { "name": "Another Name", "role": "Treasurer", "photo": "" }
      ]
    }
  ]
}
```

- **Change a name or role:** edit the text inside the quotes.
- **Upload a photo:** open `public/images/committee/`, then **Add file → Upload files**. Use a square photo with a short name, e.g. `full-name.jpg`. Write `"photo": "images/committee/full-name.jpg"`. If `photo` is `""` (or the file is missing), the site shows the person's initials.
- **Founders** have their own list. A founder who also holds office appears in both lists, with the relevant role in each. **Never delete the founders list.**

### Switch to a new committee term

1. In `src/data/members.json`, add a new block to the end of `committees` (remember the comma after the previous block):
   ```json
   ,
   {
     "term": "2027",
     "label": "Committee 2027",
     "members": [ { "name": "New President", "role": "President", "photo": "" } ]
   }
   ```
2. Change `"currentTerm": "2026"` to `"currentTerm": "2027"`.
3. Commit. The 2027 team now shows first, and the outgoing team appears automatically under **Past Committees** with its label, “Inaugural Committee (2026)”. Founders stay as they are.

### Update social links and contact details

File: `src/config.js`

- `LINKEDIN_URL`: paste the official LinkedIn page URL between the quotes, e.g. `'https://www.linkedin.com/company/...'`. Until it is set, the page name shows without a link.
- `INSTAGRAM_URL`, `INSTAGRAM_HANDLE`, `ESC_EMAIL`: change if they ever change. These update the footer, Contact page and About page everywhere at once.

### Who can make changes

Add officers under **Settings → Collaborators** (they need GitHub accounts). Remove people when they leave the committee. Turn on two-factor authentication for the account that owns the repository.

---

## Update the dashboard data

Each indicator has its own CSV file in `public/data/`:

| File | Indicator |
| --- | --- |
| `real-gdp-growth.csv` | Real GDP growth |
| `inflation.csv` | Inflation (CPI) |
| `unemployment.csv` | Unemployment rate |
| `oil-vs-non-oil-gdp.csv` | Oil and gas vs non-oil and gas GDP (two columns) |

1. Edit the CSV on GitHub: one row per year, keeping the same column names. Leave a cell empty if a figure is unavailable.
2. Open `public/data/indicators.json` and update that indicator's `source`, `sourceUrl` and `unit`.
3. **Only when every figure in the file is a verified official figure**, change `"status": "sample"` to `"status": "official"`. That removes the “Sample data” badge, watermark and download label. While any figure is a placeholder, keep `"sample"`.
4. Optional: add `"latestPeriod": "2025 Q2"` if the latest data is not a full year. Otherwise the latest year in the CSV is shown.

Official sources: DEPS national accounts (https://deps.mofe.gov.bn/national-accounts/), CPI (https://deps.mofe.gov.bn/consumer-price-index-3/) and labour force (https://deps.mofe.gov.bn/labour-force/).

The CPI practice data in the Economics Lab is in `src/pages/Lab.jsx` (the `CPI` list) and `public/data/cpi-practice.csv`. It is labelled as practice data.

---

## News & releases: add or change sources

The workflow `.github/workflows/deploy.yml` runs **once a day** (07:07 Brunei time). It runs `scripts/fetch-news.mjs`, which:

- reads the sources listed in `scripts/news-sources.json`
- removes duplicates (same link or same headline)
- **keeps a source's items from the last successful run if that source fails**
- writes `public/data/news.json`, saves it to the repository, and republishes the site

Until the first successful run, the dashboard shows clearly labelled **sample headlines**.

**To add a source**, add an entry to `scripts/news-sources.json`:

```json
{
  "id": "short-unique-id",
  "name": "Display name",
  "publisher": "Publisher name shown on each item",
  "region": "brunei",
  "kind": "headline",
  "format": "rss",
  "url": "https://example.com/feed/",
  "enabled": true
}
```

- `region`: `brunei`, `asean` or `global` (the three tabs).
- `kind`: `official` for statistical or central bank releases, `headline` for news. Students see them labelled differently.
- `format`:
  - `rss`: any RSS or Atom feed the publisher provides. Many WordPress news sites have one at `/feed/`.
  - `bdcb`: reads the BDCB publications listing page.
  - `newsapi`: a licensed news API. Put the key in **Settings → Secrets and variables → Actions → New repository secret**, named `NEWS_API_KEY`. Never put keys in the files.
- To pause a source, set `"enabled": false`.

**Check sources after the first run:** in **Actions**, open the latest run and expand *Fetch news and official releases*. Each source shows ✓ or ✗. The included feeds (DEPS, BDCB, Borneo Bulletin, The Scoop, ASEAN Briefing, CNA, BBC, CNBC, IMF) could not be tested from where this site was built, so confirm they work and switch off or replace any that show ✗. DEPS and BDCB don't advertise RSS feeds. DEPS uses WordPress's standard feed. BDCB is read from its press-release page and may need adjusting if BDCB changes its website.

**Use of headlines:** the site shows only headline, publisher, date, a short summary and a link to the original, as RSS feeds intend. Respect each publisher's terms, and use a licensed API if a publisher requires one.

---

## Connect the membership form

Member details must **not** go into this public repository. Use one of these options:

**Option A — Google Sheet (free, recommended)**

1. Using the ESC Google account, create a Google Sheet called “ESC Registrations”. Keep it private to the committee.
2. In the sheet, choose **Extensions → Apps Script**. Delete the sample code, paste in `server/registration-apps-script.gs`, and save.
3. Click **Deploy → New deployment → Select type: Web app**. Set *Execute as*: **Me** and *Who has access*: **Anyone**. Click Deploy and authorise.
4. Copy the **Web app URL** (ending in `/exec`).
5. In `src/config.js`, set `REGISTRATION_ENDPOINT: 'https://script.google.com/macros/s/.../exec'` and commit.

**Option B — Formspree:** create a form at formspree.io and paste its endpoint URL into `REGISTRATION_ENDPOINT`.

How the form behaves:
- “Thank you for registering with ESC!” appears **only after** the endpoint confirms the submission.
- If sending fails, students see an error message with the ESC email address.
- While `REGISTRATION_ENDPOINT` is empty, the Join page shows the ESC email address instead of the form.

---

## ESynC: AI backend

### Set up the AI backend

The AI key must never be in this repository. ESynC talks to a small separate server, `server/esync-worker.js`, which holds the key. It runs on Cloudflare Workers (the free plan is enough).

1. Create an API key at console.anthropic.com and add billing credit. (Any AI provider works if you adapt the worker.)
2. Create a free Cloudflare account. On a computer with Node.js:
   ```bash
   cd server
   npx wrangler login
   # edit wrangler.toml: set ALLOWED_ORIGIN to https://YOUR-USERNAME.github.io
   npx wrangler secret put ANTHROPIC_API_KEY     # paste the key when asked
   npx wrangler deploy
   ```
   Wrangler prints the worker URL, e.g. `https://esync.your-account.workers.dev`.
   (Alternative without a terminal: Cloudflare dashboard → Workers → Create → paste `esync-worker.js`, then add `ANTHROPIC_API_KEY` as a secret and `ALLOWED_ORIGIN` as a variable under Settings → Variables.)
3. In `src/config.js`, set `ESYNC_ENDPOINT` to that URL and commit.
4. **Test it:** open the live site, go to the dashboard, tap **Ask ESynC** on a chart, then tap a starter question. You should get an answer that cites the source and period and says the figures are sample data while they are. If you see “couldn’t be reached”, check that `ALLOWED_ORIGIN` exactly matches your site address (no trailing slash), then check the worker's logs in Cloudflare.

What ESynC receives: the conversation, where it was opened from (chart and year range, simulator values, or news item), and the website's datasets with their source, period and sample/official status. Its instructions (in `esync-worker.js`) tell it to explain in plain language, cite only the site's datasets for Brunei figures, flag sample data, say when data is unavailable, link to news sources, separate reported facts from possible effects, and say when it only has a headline.

Set a monthly spending limit in the Anthropic console.

---

## Brand fonts

Headings use **Plate Gothic Three Four**. Body text uses the device's own system font: San Francisco on Apple devices (shown by the device, not hosted by us) and the free Inter font (SIL Open Font License, in `public/fonts/`) everywhere else. Check that your Plate Gothic licence allows web use.

---

## The Invisible Handshake Series: past sessions from Instagram

Open `src/data/ihs-posts.json` and paste @theihs.esc post links into `posts` (newest first), e.g.

```json
"posts": [
  "https://www.instagram.com/p/ABC123/",
  "https://www.instagram.com/p/DEF456/"
]
```

Each post appears on The Invisible Handshake Series page with its photos and caption, using Instagram's official embed, so edits on Instagram show up automatically.

## Merch

Edit `src/data/merch.json` (see its `_example`). Upload product photos to `public/images/merch/`. Set one order link for everything in `src/config.js` → `MERCH_ORDER_URL`, or give a product its own `orderUrl`. With no link, the Order button emails the committee.

## Testing checklist

The first version was tested in a browser at phone (iPhone 13), iPad and desktop sizes:

- [x] Navigation to every page, including the mobile menu; no sideways scrolling on phones
- [x] Year filter, chart tooltips (hover, tap and arrow keys), CSV downloads filtered by year and labelled as sample
- [x] Simulator: demand and supply shifts, original and new equilibrium, reset; CPI exercise answer check
- [x] Chart, simulator and news context passed into ESynC, with matching starter questions
- [x] Registration: validation, failure message with email, success message only after success, email fallback when not connected
- [x] Events: upcoming/past split, empty state linking @escbrunei, Events → series page navigation
- [x] Members: current term, founders, past committees appear automatically after a term switch, initials when no photo
- [x] Footer stacks on phones; email opens a new email; Instagram link; LinkedIn name and configurable link
- [x] News fetcher: duplicate removal and keeping the last successful items when a source fails

After going live, re-check on a real phone: open Ask ESynC, open the membership form, and confirm the Actions news run shows ✓ for the sources.

---

## Where things live

```
.github/workflows/deploy.yml   daily news refresh (07:07 Brunei time) + automatic deploy to GitHub Pages
public/data/*.csv              dashboard datasets (one per indicator)
public/data/indicators.json    source, unit, status for each dataset
public/data/news.json          news feed (written by the workflow)
public/images/esync-robot.png  ESynC robot-cat mascot
public/images/esc-crest.png    ESC crest (homepage)
public/fonts/                  brand font files
public/images/committee/       committee photos
public/images/events/          event photos
scripts/news-sources.json      news sources (edit to add or change)
scripts/fetch-news.mjs         news fetcher
server/esync-worker.js         ESynC AI backend (deploy separately, holds the API key)
server/registration-apps-script.gs  private membership form endpoint
src/config.js                  email, social links, endpoints
src/data/events.json           all events and recaps
src/data/members.json          committee, founders, past terms
src/pages/                     page content
src/styles.css                 colours and layout
```
