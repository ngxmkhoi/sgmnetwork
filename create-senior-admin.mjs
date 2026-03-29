import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.error("❌ Cách dùng: node --env-file=.env.local create-senior-admin.mjs <email> <password>");
    process.exit(1);
}

console.log("🔄 Tạo user senior_admin...\n");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
});

// 1. Lấy hoặc tạo user trong auth.users
let userId;
const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
const existingUser = authUsers?.find(u => u.email === email);

if (existingUser) {
    console.log(`✓ User ${email} đã tồn tại trong auth`);
    userId = existingUser.id;

    // Cập nhật password
    await supabase.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
        app_metadata: { role: "senior_admin" }
    });
} else {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: "senior_admin" },
    });

    if (authError) {
        console.error("❌ Lỗi tạo auth user:", authError.message);
        process.exit(1);
    }
    console.log(`✓ Tạo auth user: ${email}`);
    userId = authUser.user.id;
}

// 2. Tạo/cập nhật profile trong public.users với role=senior_admin
const { data: profile, error: profileError } = await supabase
    .from("users")
    .upsert({
        id: userId,
        email,
        role: "senior_admin",
    })
    .select()
    .single();

if (profileError) {
    console.error("❌ Lỗi tạo profile:", profileError.message);
    process.exit(1);
}

console.log(`✓ Tạo user profile: ${email}`);
console.log(`✓ Role: ${profile.role} (VAI TRÒ CAO NHẤT)`);
console.log(`✓ User ID: ${userId}`);

console.log("\n✅ Hoàn tất!");
console.log(`\n🔐 Đăng nhập bằng:`);
console.log(`   Email: ${email}`);
console.log(`   Password: ${password}`);
console.log("\n▶️  Chạy: npm run dev");
