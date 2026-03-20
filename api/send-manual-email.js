// api/send-manual-email.js
const RESEND_API_KEY = "re_JSjYKBd5_NLhRsiuGP8fmSDL5EHDj3rNW";
const FROM_EMAIL = "Bursdagstracker <noreply@shahiftah.me>";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Mangler navn, e-post eller melding" });
  }

  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `En hilsen til deg, ${name}!`,
        html: `
          <!DOCTYPE html>
          <html lang="no">
          <head><meta charset="UTF-8"></head>
          <body style="margin:0;padding:0;background:#F4F5F7;font-family:'Helvetica Neue',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:40px 20px;">
              <tr><td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background:#1D4ED8;padding:36px 40px;text-align:center;">
                      <div style="font-size:48px;margin-bottom:12px;">✉️</div>
                      <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">En hilsen til deg</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="margin:0 0 16px;font-size:16px;color:#1F2933;">Hei <strong>${name}</strong>! 👋</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background:#F4F5F7;border-left:4px solid #1D4ED8;border-radius:0 8px 8px 0;padding:16px 20px;">
                            <p style="margin:0;font-size:15px;color:#1F2933;line-height:1.8;white-space:pre-line;">${message}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#F4F5F7;padding:20px 40px;text-align:center;border-top:1px solid #E4E7EB;">
                      <p style="margin:0;font-size:12px;color:#9AA5B4;">Sendt via Bursdagstracker</p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.json();
      return res.status(500).json({ error: err.message || "Kunne ikke sende e-post" });
    }

    return res.status(200).json({ message: `E-post sendt til ${email}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
