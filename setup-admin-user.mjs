import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
});

const email = "blazehunter01062008@gmail.com";
const password = "SGMNetwork@2026!Secure";

console.log("🔄 Tạo user admin...\n");

// 1. Lấy hoặc tạo user trong auth.users
let userId;
const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
const existingUser = authUsers?.find(u => u.email === email);

if (existingUser) {
    console.log(`✓ User ${email} đã tồn tại trong auth`);
    userId = existingUser.id;
} else {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: "admin" },
    });

    if (authError) {
        console.error("❌ Lỗi tạo auth user:", authError.message);
        process.exit(1);
    }
    console.log(`✓ Tạo auth user: ${email}`);
    userId = authUser.user.id;
}

// 2. Tạo profile trong public.users
const { data: profile, error: profileError } = await supabase
    .from("users")
    .upsert({
        id: userId,
        email,
        role: "admin",
    })
    .select()
    .single();

if (profileError) {
    console.error("❌ Lỗi tạo profile:", profileError.message);
    process.exit(1);
}

console.log(`✓ Tạo user profile: ${email}`);
console.log(`✓ Role: ${profile.role}`);
console.log(`✓ User ID: ${userId}`);

// 3. Kiểm tra settings
const { data: settings, error: settingsError } = await supabase
    .from("settings")
    .select("*");

if (settingsError) {
    console.error("❌ Lỗi kiểm tra settings:", settingsError.message);
} else {
    console.log(`\n📊 Settings hiện có: ${settings?.length || 0} items`);
}

console.log("\n✅ Hoàn tất!");
console.log(`\n🔐 Đăng nhập bằng:`);
console.log(`   Email: ${email}`);
console.log(`   Password: ${password}`);
console.log("\n▶️  Chạy: npm run dev");
