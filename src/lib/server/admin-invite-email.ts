import { siteConfig } from "@/lib/constants/site";

type SendAdminInviteEmailInput = {
  email: string;
  expiresAt: string;
  redirectTo?: string;
};

function buildInviteEmailHtml(email: string, expiresAt: string, redirectTo?: string) {
  const expireDate = new Date(expiresAt).toLocaleString("vi-VN");
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111118;border:1px solid #1e1e2e;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#0052ff 0%,#003acc 100%);padding:32px 36px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;color:rgba(255,255,255,0.6);text-transform:uppercase;">SGM NETWORK</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#fff;letter-spacing:0.04em;text-transform:uppercase;">Lời Mời Tạo Tài Khoản Admin</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 16px;font-size:15px;color:#c8c8d8;line-height:1.7;">
              Bạn được mời tạo tài khoản quản trị viên cho <strong style="color:#fff;">SGM Network</strong>.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d16;border:1px solid #1e1e2e;border-radius:10px;padding:16px 18px;margin-bottom:24px;">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.16em;color:#4a4a6a;text-transform:uppercase;">Email được mời</p>
                  <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#e8e8f0;">${email}</p>
                  <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.16em;color:#4a4a6a;text-transform:uppercase;">Hết hạn lúc</p>
                  <p style="margin:0;font-size:14px;color:#e8e8f0;">${expireDate}</p>
                </td>
              </tr>
            </table>
            ${redirectTo ? `
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${redirectTo}" style="display:inline-block;background:linear-gradient(135deg,#0052ff,#003acc);color:#fff;font-size:14px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:10px;">
                    Tạo Tài Khoản Ngay
                  </a>
                </td>
              </tr>
            </table>
            ` : ""}
          </td>
        </tr>
        <tr>
          <td style="background:#0d0d16;border-top:1px solid #1e1e2e;padding:20px 36px;">
            <p style="margin:0;font-size:11px;color:#4a4a6a;text-align:center;letter-spacing:0.08em;">
              © ${new Date().getFullYear()} SGM NETWORK · <a href="${siteConfig.url}" style="color:#0052ff;text-decoration:none;">${siteConfig.url}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendAdminInviteEmail(input: SendAdminInviteEmailInput) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    return { sent: false, configured: false, error: "Chưa cấu hình GMAIL_USER / GMAIL_APP_PASSWORD." };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"SGM Network Admin" <${gmailUser}>`,
      to: input.email,
      subject: "[SGM Network] Lời mời tạo tài khoản Admin",
      html: buildInviteEmailHtml(input.email, input.expiresAt, input.redirectTo),
    });

    return { sent: true, configured: true };
  } catch (err) {
    console.error("[admin-invite] Gửi email thất bại:", err);
    return { sent: false, configured: true, error: String(err) };
  }
}
