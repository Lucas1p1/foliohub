import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@Introhub.co";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://Introhub.co";

export async function sendWelcomeEmail(email: string, username: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your ${APP_NAME} page is ready 🎉`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #111;">
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 8px;">Welcome to ${APP_NAME}</h1>
        <p style="color: #555; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
          Your personal page is live at:
        </p>
        <a href="${APP_URL}/${username}"
           style="display:inline-block; background:#111; color:#fff; padding:12px 24px;
                  border-radius:8px; text-decoration:none; font-weight:500; font-size:15px;">
          ${APP_URL}/${username}
        </a>
        <p style="color:#555; margin:32px 0 8px; font-size:15px; line-height:1.6;">
          Next steps:
        </p>
        <ul style="color:#555; font-size:15px; line-height:1.8; padding-left:20px;">
          <li>Add your profile photo and headline</li>
          <li>Add 2–3 of your best projects</li>
          <li>Add your WhatsApp number so clients can reach you</li>
          <li>Publish your page and share the link</li>
        </ul>
        <a href="${APP_URL}/dashboard"
           style="display:inline-block; margin-top:24px; color:#111; font-size:14px;">
          Go to your dashboard →
        </a>
        <hr style="border:none; border-top:1px solid #eee; margin:40px 0 24px;" />
        <p style="color:#999; font-size:12px; margin:0;">
          You're receiving this because you signed up for ${APP_NAME}.
        </p>
      </div>
    `,
  });
}

export async function sendProUpgradeEmail(email: string, username: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `You're now on ${APP_NAME} Pro ⚡`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #111;">
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 8px;">You're on Pro now</h1>
        <p style="color: #555; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
          Your ${APP_NAME} Pro features are now active:
        </p>
        <ul style="color:#555; font-size:15px; line-height:1.8; padding-left:20px;">
          <li>Analytics — see who's viewing your page</li>
          <li>All 3 templates unlocked</li>
          <li>No ${APP_NAME} branding on your page</li>
        </ul>
        <a href="${APP_URL}/dashboard"
           style="display:inline-block; margin-top:24px; background:#111; color:#fff;
                  padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:500;">
          Go to dashboard →
        </a>
      </div>
    `,
  });
}