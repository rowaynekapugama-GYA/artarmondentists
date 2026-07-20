# Artarmon Dentists — Children's Orthodontics Landing Page

A single-page, liquid-glass lead-gen site for **Orthodontics for Children**, built to match the other GYA dental landing pages. Desktop scrolls vertically with a side progress nav; mobile is a horizontal swipe deck with a bottom dock.

The booking form captures the **parent's name + the child's name** (and optional age) and emails each enquiry to your practice inbox through a small same-origin serverless relay.

---

## Files

| File | What it is |
|------|------------|
| `index.html` | The entire site (HTML + CSS + JS in one file) |
| `api/lead.js` | Vercel serverless function — receives the form POST and emails it |
| `team.webp` | Artarmon team group shot (used in the "Our team" section) |
| `clinic.webp` | Clinic photo used as the **Dr Radhika video placeholder** (swap for video when ready) |
| `hero.webp` | Your reception photo — the hero/banner background image |
| `logo.png` | Your logo (original dark version, transparent) |
| `logo-white.png` | White version of your logo, used in the (dark) header & footer |
| `prob-*.webp` (×9) | Clinical photos for the "Problems to watch for" cards |
| `platinum-invisalign.webp` | Platinum Invisalign Provider badge (Dr Radhika's profile) |
| `invisalign.png` / `angel-aligner.png` | Aligner brand logos (rendered white on the dark theme) |
| `package.json` | Project metadata for Vercel |
| `SETUP.md` | This file |

---

## Deploy (GitHub → Vercel)

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo. No build step or framework preset needed — it deploys as static + the `/api` function automatically.
3. Add the environment variables below, then **redeploy** so they take effect.

### Required environment variables
`Project → Settings → Environment Variables`

| Variable | Required | Notes |
|----------|----------|-------|
| `SMTP2GO_API_KEY` | ✅ | Your SMTP2GO API key (e.g. `api-XXXXXXXX`). |
| `INTAKE_ADDRESS` | ✅ | The inbox leads are emailed to. **The form will not deliver until this is set.** |
| `SMTP_FROM` | optional | From header. Default: `Artarmon Dentists <no-reply@artarmondentists.com>`. Use a domain you've verified in SMTP2GO. |
| `ALLOW_ORIGIN` | optional | CORS origin. Default `*` (same-origin needs nothing). |

### Verify the function is live
Open `https://YOURSITE/api/lead` in a browser (a GET):

- `{"ok":false,"error":"Method not allowed"}` → **function is live** ✅
- `404` → it isn't deployed inside an `/api` folder ❌

When a real lead is submitted you'll get an email with the parent, child (and age), email, phone, and any concerns ticked. The visitor's email is set as **Reply-To** so you can reply straight from your inbox.

---

## Before going live — checklist

- [ ] **`INTAKE_ADDRESS`** set in Vercel (otherwise the form returns a "Server not configured" error).
- [ ] **`SMTP2GO_API_KEY`** set, and `SMTP_FROM` uses a domain verified in SMTP2GO.
- [ ] Send a test enquiry and confirm the email arrives.
- [ ] **Dr Radhika video** — the "Meet Dr Radhika" block currently shows `clinic.webp` with a "video coming soon" caption and acts as a Book button. When the video is ready, swap that block for an embed (same pattern as the Vimeo "Our story" section).
- [ ] **Logo** — the top bar and footer now use your supplied logo (`logo-white.png`, recoloured white for the dark theme). The original is included as `logo.png`. Replace either file if you have a preferred lockup.
- [ ] Confirm the **$50 consultation fee** wording and **payment-plans** framing match how you describe them to patients.
- [ ] Confirm usage rights for the nine AAO clinical photos now used in the "Problems to watch for" section.

---

## Notes

- The **"Problems to watch for"** section now shows the nine **real clinical photos** (cropped from the AAO "Problems to Watch for in Growing Children" infographic you supplied) as `prob-*.webp` files. Note these photos originate from third-party AAO patient-education material — confirm you're comfortable with the usage rights before going live.
- The page uses a **monochrome (black / white / grey)** palette to match your branding, on the existing dark liquid-glass layout, with your reception photo behind the hero.
- The **"Our story"** video is the Vimeo embed you supplied (`vimeo.com/1189722536`).
- Content is drawn from your interceptive-orthodontics page and team page (three treatment stages, why-early benefits, Dr Radhika's bio, 40+ years in Artarmon).
- The page is currently set to **`noindex`** (`<meta name="robots" content="noindex, follow">` in the `<head>`) — the usual choice for a paid-ad landing page, so it doesn't compete with your main site or create duplicate content. If you want it discoverable in Google search, delete that meta tag.
