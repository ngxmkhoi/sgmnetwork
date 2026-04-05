import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// Helper để query các bảng chưa có trong generated types
// Dùng thay cho (supabase as any) để tránh eslint no-explicit-any
export function getUntypedClient() {
  const client = createAdminSupabaseClient();
  if (!client) return null;
  return client as unknown as {
    from: (table: string) => ReturnType<ReturnType<typeof createAdminSupabaseClient>["from"]>;
  };
}
