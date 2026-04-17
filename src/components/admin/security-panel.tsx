"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldAlert, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SecurityPanel() {
  const [kicking, setKicking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleKickAll = async () => {
    setKicking(true);
    const res = await fetch("/api/admin/security/kick-all", { method: "POST" });
    setKicking(false);
    setShowConfirm(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      if (res.status === 403) {
        toast.error("CHỈ QUẢN TRỊ VIÊN CẤP CAO MỚI CÓ QUYỀN NÀY.");
      } else {
        toast.error(data.error ?? "THAO TÁC THẤT BẠI.");
      }
      return;
    }

    const data = await res.json() as { kicked?: number };
    toast.success(`ĐÃ KICK ${data.kicked ?? 0} NGƯỜI DÙNG KHỎI HỆ THỐNG.`);
  };

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 border border-destructive/20">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
          <ShieldAlert className="size-5 text-destructive" />
        </div>
        <div>
          <p className="font-heading text-base font-bold uppercase tracking-wide text-foreground">
            BẢO MẬT KHẨN CẤP
          </p>
          <p className="text-xs text-muted-foreground">Chỉ Quản Trị Viên Cấp Cao mới có quyền thực hiện.</p>
        </div>
      </div>

      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Kick Toàn Bộ Người Dùng</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Đăng xuất tất cả tài khoản đang đăng nhập khỏi hệ thống ngay lập tức. Dùng khi phát hiện xâm nhập trái phép.
          </p>
        </div>

        {!showConfirm ? (
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white"
            onClick={() => setShowConfirm(true)}
          >
            <LogOut className="mr-2 size-4" />
            KICK TẤT CẢ NGƯỜI DÙNG
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-bold text-destructive uppercase">
              ⚠️ Xác nhận? Tất cả người dùng sẽ bị đăng xuất ngay lập tức!
            </p>
            <div className="flex gap-2">
              <Button
                className="bg-destructive hover:bg-destructive/90 text-white"
                disabled={kicking}
                onClick={handleKickAll}
              >
                {kicking ? "ĐANG XỬ LÝ..." : "XÁC NHẬN KICK TẤT CẢ"}
              </Button>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                HỦY
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
