import type { Metadata } from "next";
import { SettingsAdminPanel } from "@/components/admin/settings-admin-panel";
import { SecurityPanel } from "@/components/admin/security-panel";

export const metadata: Metadata = {
  title: "Cài Đặt",
  description: "Quản trị SEO, giao diện trang chủ và cấu hình hệ thống.",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsAdminPanel />
      <SecurityPanel />
    </div>
  );
}
