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
| `angel-aligner.png` | Angel Aligner logo (rendered white on the dark theme) |
| `package.json` | Project metadata for Vercel |
| `SETUP.md` | This file |

---

## Deploy (GitHub → Vercel)

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo. No build step or framework preset needed — it deploys as static + the `/api` function automatically.
3. Add the environment variables below, then **redeploy** so they take effect.

### Environment variables
`Project → Settings → Environment Variables`

Only **one** variable is required — the SMTP2GO API key. It's kept out of the
code on purpose so it isn't committed to your Git repo (anyone with the key can
send email as you). Paste it into Vercel and redeploy:

| Variable | Required | Value / notes |
|----------|----------|---------------|
| `SMTP2GO_API_KEY` | ✅ | `api-023CC748598A4F5C8F0E2B92C697D037` |
| `INTAKE_ADDRESS` | optional | Defaults to your SmileOx intake address (baked into `api/lead.js`). Only set this to override it. |
| `SMTP_FROM` | optional | From header. Default: `Artarmon Dentists <no-reply@artarmondentists.com>`. **Must be a domain verified in SMTP2GO** or delivery will fail. |
| `ALLOW_ORIGIN` | optional | CORS origin. Default `*` (same-origin needs nothing). |

**How the form feeds SmileOx:** the form POSTs to `/api/lead`, which emails the
submission — as a JSON body — to your SmileOx intake address
(`artarmon-kids-landing+…@intake.smileox.com.au`). SmileOx reads that JSON and
creates/updates a lead in your pipeline. The relay sends via the SMTP2GO HTTPS
API, and SMTP2GO delivers on to SmileOx over TLS. Fields sent: `firstName`,
`lastName`, `email`, `phoneNumber`, plus `childName`, `childAge`, `concerns` and
a `source` tag (stored as lead detail). Leads are de-duplicated by email + phone,
so multi-step or repeat submissions update the same lead rather than duplicating it.

### Verify the function is live
Open `https://YOURSITE/api/lead` in a browser (a GET):

- `{"ok":false,"error":"Method not allowed"}` → **function is live** ✅
- `404` → it isn't deployed inside an `/api` folder ❌

When a real lead is submitted, a new lead appears in your SmileOx pipeline with the parent, child (and age), email, phone and any concerns ticked. The visitor's email is set as **Reply-To** on the underlying message.

---

## Before going live — checklist

- [ ] **`SMTP2GO_API_KEY`** set in Vercel and redeployed (otherwise the form returns a "Server not configured" error).
- [ ] `SMTP_FROM` uses a domain **verified in SMTP2GO** (the default `artarmondentists.com` must be verified there, or delivery is rejected).
- [ ] Send a test enquiry and confirm a new lead appears in **SmileOx** with all fields correct.
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
