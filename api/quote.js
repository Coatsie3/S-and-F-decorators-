// Sends quote enquiries to S&F via Resend. Uses RESEND_API_KEY from Vercel env.
const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ error: "Email service is not configured" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const { name, email, phone, message, website } = body || {};
  if (website) return res.status(200).json({ success: true }); // honeypot: silently drop bots
  if (!name || !email || !phone || !message) return res.status(400).json({ error: "All fields are required" });
  if (String(message).length > 5000 || String(name).length > 200) return res.status(400).json({ error: "Message too long" });

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: "S & F Premier Decorators Ltd <noreply@kcdesign.je>",
      to: ["sf.decorators@hotmail.co.uk"],
      reply_to: String(email),
      subject: `New Quote Request from ${esc(name)}`,
      html: `<h2>New Quote Request</h2>
<p><strong>Name:</strong> ${esc(name)}</p>
<p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
<p><strong>Phone:</strong> ${esc(phone)}</p>
<hr />
<p><strong>Message:</strong></p>
<p>${esc(message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
  const text = await r.text();
  let data = {}; try { data = JSON.parse(text); } catch {}
  if (!r.ok || !data.id) {
    console.error("Resend error", r.status, text);
    return res.status(502).json({ error: "Email send failed" });
  }
  return res.status(200).json({ success: true, id: data.id });
}
