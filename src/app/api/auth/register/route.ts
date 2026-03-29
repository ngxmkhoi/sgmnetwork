import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/server/api-guard";
import {
  ensureUserAccount,
  consumeInvitedEmail,
  getInvitedEmails,
  isEmailInvited,
} from "@/lib/data/content-service";
import { logAdminActivity } from "@/lib/server/admin-activity";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "auth-register", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();

  // Kiểm tra email có trong danh sách mời không
  const invitedEmails = await getInvitedEmails();
  if (!isEmailInvited(email, invitedEmails)) {
    return NextResponse.json({ error: "Email không được mời." }, { status: 403 });
  }

  // Lấy user ID từ Supabase Auth
  const adminClient = createAdminSupabaseClient();
  if (!adminClient) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }

  const { data: listData } = await adminClient.auth.admin.listUsers();
  const authUser = listData?.users?.find((u) => u.email?.toLowerCase() === email);
  if (!authUser) {
    return NextResponse.json({ error: "User chưa tồn tại trong Auth." }, { status: 404 });
  }

  // Tạo record trong bảng users
  const user = await ensureUserAccount({ id: authUser.id, email, role: "editor" });

  // Xóa khỏi danh sách mời
  await consumeInvitedEmail(email);

  await logAdminActivity({
    actorEmail: email,
    action: "ADMIN_ACCOUNT_CREATED",
    targetType: "USER",
    targetId: user.id,
    summary: `Tạo tài khoản admin qua thư mời cho ${email}`,
  });

  return NextResponse.json({ ok: true, user });
}
