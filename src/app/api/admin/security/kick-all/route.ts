import { NextRequest, NextResponse } from "next/server";
import { enforceAdminApiAuth, enforceRateLimit } from "@/lib/server/api-guard";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { logAdminActivity } from "@/lib/server/admin-activity";
import { getAuthContext } from "@/lib/server/auth";

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, { name: "kick-all", limit: 3, windowMs: 60_000 });
  if (limited) return limited;

  // Chỉ senior_admin mới được dùng
  const denied = await enforceAdminApiAuth({ minimumRole: "senior_admin" });
  if (denied) return denied;

  const adminClient = createAdminSupabaseClient();
  if (!adminClient) return NextResponse.json({ error: "Server error." }, { status: 500 });

  // Lấy danh sách tất cả user
  const { data: users, error } = await adminClient.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const auth = await getAuthContext();
  const currentUserId = auth.userId;

  // Sign out tất cả user trừ người đang thực hiện
  let kicked = 0;
  await Promise.allSettled(
    (users.users ?? []).map(async (u) => {
      if (u.id === currentUserId) return; // Không kick chính mình
      await adminClient.auth.admin.signOut(u.id, "global");
      kicked++;
    })
  );

  await logAdminActivity({
    actorEmail: auth.email ?? "senior_admin",
    action: "SECURITY_KICK_ALL",
    targetType: "AUTH",
    targetId: "all",
    summary: `Kick toàn bộ ${kicked} người dùng khỏi hệ thống`,
  });

  return NextResponse.json({ ok: true, kicked });
}
