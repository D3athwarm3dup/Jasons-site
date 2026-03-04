import nodemailer from "nodemailer";

interface EnquiryData {
  name: string;
  email?: string | null;
  phone?: string | null;
  service?: string | null;
  message: string;
}

export async function sendEnquiryNotification(data: EnquiryData) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, NOTIFY_EMAIL } = process.env;

  // Silently skip if email notifications are not configured
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const from = SMTP_FROM || SMTP_USER;
  const serviceLabel = data.service ? `<strong>Service:</strong> ${data.service}<br>` : "";
  const emailLabel = data.email ? `<strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a><br>` : "";
  const phoneLabel = data.phone ? `<strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a><br>` : "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ffffff; margin: 0; font-size: 18px;">
          New Enquiry — Norris Decking &amp; Sheds
        </h2>
      </div>
      <div style="background: #f9f5ef; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #333;">
          You've received a new enquiry from your website.
        </p>
        <div style="background: #ffffff; padding: 16px 20px; border-radius: 6px; border-left: 4px solid #c8a96e; margin-bottom: 20px; font-size: 15px; line-height: 1.8; color: #333;">
          <strong>Name:</strong> ${data.name}<br>
          ${emailLabel}
          ${phoneLabel}
          ${serviceLabel}
        </div>
        <div style="background: #ffffff; padding: 16px 20px; border-radius: 6px; border: 1px solid #e5e5e5;">
          <strong style="font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Message</strong>
          <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.6; color: #333; white-space: pre-wrap;">${data.message}</p>
        </div>
        <p style="margin: 20px 0 0; font-size: 13px; color: #999; text-align: center;">
          Norris Decking &amp; Sheds · norrisdeckingandfencing.com.au
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Norris Decking & Sheds" <${from}>`,
    to: NOTIFY_EMAIL,
    subject: `New enquiry from ${data.name}`,
    html,
    text: [
      `New enquiry from ${data.name}`,
      data.email ? `Email: ${data.email}` : "",
      data.phone ? `Phone: ${data.phone}` : "",
      data.service ? `Service: ${data.service}` : "",
      `\n${data.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
