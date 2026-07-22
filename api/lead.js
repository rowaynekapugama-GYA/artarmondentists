// api/lead.js — Artarmon Dentists lead relay (Vercel serverless function)
// ---------------------------------------------------------------------------
// Receives the booking-form POST from index.html and forwards it to SmileOx.
//
// SmileOx creates a CRM lead from any email sent to its unique intake address,
// where the *plain-text email body* is the JSON payload. A browser can't send
// email directly, so this small same-origin relay sends it server-side through
// the SMTP2GO HTTP API (HTTPS, so the API call is always over TLS; SMTP2GO then
// delivers on to intake.smileox.com.au using TLS).
//
// >>> This works out of the box — no Vercel config needed — because the SMTP2GO
//     key is set as FALLBACK_API_KEY below.
//
// SECURITY NOTE: that key now lives in this file. Keep your Git repository
// PRIVATE. The cleaner long-term setup is to move the key into a Vercel
// environment variable (SMTP2GO_API_KEY) and blank out FALLBACK_API_KEY — the
// env var takes precedence whenever it's present. If the key is ever exposed,
// rotate it in the SMTP2GO dashboard and update it here (or in the env var).
//
// Optional env overrides (all have sensible defaults):
//   SMTP2GO_API_KEY   Overrides FALLBACK_API_KEY below.
//   INTAKE_ADDRESS    SmileOx intake address (defaults to the Artarmon kids' intake).
//   SMTP_FROM         From header. Default: Artarmon Dentists <no-reply@artarmondentists.com>
//                     (use a domain verified in SMTP2GO, or delivery is rejected).
//   ALLOW_ORIGIN      CORS origin. Default: "*" (same-origin needs nothing).
//
// Quick test once deployed:  GET https://YOURSITE/api/lead  ->  {"ok":false,"error":"Method not allowed"}
// (That JSON means the function is live. A 404 means it isn't deployed in an /api folder.)
// ---------------------------------------------------------------------------

// SMTP2GO API key — baked in so the form works without any Vercel config.
// Move this to a Vercel env var and blank it out for a cleaner setup (see note above).
const FALLBACK_API_KEY = "api-023CC748598A4F5C8F0E2B92C697D037";

// SmileOx intake address for this landing page (override via env if it ever changes).
const DEFAULT_INTAKE = "artarmon-kids-landing+695439a7-a3c7-4170-b3d4-8d6b47919a4c@intake.smileox.com.au";

module.exports = async (req, res) => {
  const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ ok: false, error: "Method not allowed" }); return; }

  // ---- parse body (Vercel usually parses JSON; be defensive) ----
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (!body || typeof body !== "object") body = {};

  // ---- honeypot: pretend success, send nothing ----
  if (body.company) { res.status(200).json({ ok: true }); return; }

  // ---- configuration (env vars win; otherwise the baked-in defaults) ----
  const API_KEY = process.env.SMTP2GO_API_KEY || FALLBACK_API_KEY;
  const TO = process.env.INTAKE_ADDRESS || DEFAULT_INTAKE;
  const FROM = process.env.SMTP_FROM || "Artarmon Dentists <no-reply@artarmondentists.com>";
  if (!API_KEY) { res.status(500).json({ ok: false, error: "Server not configured", missing: ["SMTP2GO_API_KEY"] }); return; }

  // ---- build the SmileOx JSON payload ----
  // firstName / lastName / email / phoneNumber are SmileOx's standard fields
  // (the parent/guardian is the lead). Everything else is stored as lead detail.
  const v = (k) => (body[k] == null ? "" : String(body[k]).trim());
  const email = v("email");
  const phoneNumber = v("phoneNumber");

  const payload = {
    firstName: v("firstName"),
    lastName: v("lastName"),
    email: email,
    phoneNumber: phoneNumber,
    childName: v("childName"),
    childAge: v("childAge"),
    concerns: v("concerns"),
    source: "Artarmon kids' orthodontics landing page"
  };
  // drop empty fields so the lead record stays clean
  Object.keys(payload).forEach(function (k) { if (payload[k] === "") delete payload[k]; });

  const jsonBody = JSON.stringify(payload);

  // ---- send via SMTP2GO HTTP API (body = the JSON SmileOx parses) ----
  try {
    const r = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json", "X-Smtp2go-Api-Key": API_KEY },
      body: JSON.stringify({
        api_key: API_KEY,
        to: [TO],
        sender: FROM,
        subject: "Website form submission - Artarmon kids' orthodontics",
        text_body: jsonBody,
        custom_headers: email ? [{ header: "Reply-To", value: email }] : []
      })
    });

    const out = await r.json().catch(function () { return {}; });
    const data = (out && out.data) ? out.data : {};
    const sent = Number(data.succeeded || 0);
    const failed = Number(data.failed || 0);

    if (!r.ok || sent < 1 || failed > 0) {
      let detail = data.failures || data.error || out.error || out.error_code || ("HTTP " + r.status);
      if (typeof detail !== "string") detail = JSON.stringify(detail);
      res.status(502).json({ ok: false, error: "Email send failed", detail: detail });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ ok: false, error: "Email send failed", detail: String(e && e.message ? e.message : e) });
  }
};
