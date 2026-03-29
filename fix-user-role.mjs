import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

console.log("🔌 Kết nối đến Supabase...");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

// Lấy tất cả users
const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*");

if (usersError) {
    console.error("❌ Lỗi khi lấy danh sách users:", usersError.message);
    process.exit(1);
}

console.log("\n📋 Danh sách users hiện tại:");
console.log("─".repeat(60));

if (!users || users.length === 0) {
    console.log("❌ Chưa có user nào trong bảng public.users");
    console.log("\n💡 Yêu cầu: Tạo user trong Supabase Auth trước!");
    process.exit(1);
}

users.forEach((user) => {
    console.log(`📧 Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Tạo lúc: ${new Date(user.created_at).toLocaleString("vi-VN")}`);
    console.log("─".repeat(60));
});

// Nâng cấp tất cả users lên admin
console.log("\n🔄 Nâng cấp tất cả users lên role 'admin'...");

const { error: updateError } = await supabase
    .from("users")
    .update({ role: "admin" })
    .neq("role", "admin");

if (updateError) {
    console.error("❌ Lỗi cập nhật:", updateError.message);
    process.exit(1);
}

// Kiểm tra lại
const { data: updatedUsers, error: checkError } = await supabase
    .from("users")
    .select("*");

if (checkError) {
    console.error("❌ Lỗi kiểm tra:", checkError.message);
    process.exit(1);
}

console.log("\n✅ Cập nhật thành công!");
console.log("\n📋 Danh sách users sau khi cập nhật:");
console.log("─".repeat(60));

updatedUsers?.forEach((user) => {
    console.log(`📧 ${user.email} → Role: ${user.role}`);
});

console.log("─".repeat(60));
console.log("\n✨ Bây giờ bạn có thể chạy 'npm run dev' lại!");
