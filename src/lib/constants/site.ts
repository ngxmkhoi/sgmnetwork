export const siteConfig = {
  name: "SGM Network",
  shortName: "SGM Network",
  description:
    "Cộng đồng game fan-made với lịch sự kiện, tin tức, gallery và hệ thống quản trị hiện đại theo phong cách Free Fire.",
  url: "https://sgmnetwork.vercel.app",
  productionUrl: "https://sgmnetwork.vercel.app",
  ogImage: "/og-image.png",
  favicon: "https://ik.imagekit.io/oyvgbkwyt/SGM%20NETWORK/29032026/b21232026.png?updatedAt=1774797861035",
  sidebarIcon: "https://ik.imagekit.io/oyvgbkwyt/SGM%20NETWORK/29032026/b21232026.png?updatedAt=1774797861035",
  links: {
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
  },
  contactEmail: "blazehunter01062008@gmail.com",
} as const;

export const navItems = [
  { title: "TRANG CHỦ", href: "/" },
  { title: "LỊCH", href: "/calendar" },
  { title: "SỰ KIỆN", href: "/events" },
  { title: "PHÁT TRỰC TIẾP", href: "/esports" },
  { title: "TIN TỨC", href: "/news" },
  { title: "LIÊN HỆ", href: "/contact" },
] as const;

export const adminNavItems = [
  { title: "DASHBOARD", href: "/admin" },
  { title: "SỰ KIỆN", href: "/admin/events" },
  { title: "PHÁT TRỰC TIẾP", href: "/admin/esports" },
  { title: "TIN TỨC", href: "/admin/news" },
  { title: "THƯ VIỆN", href: "/admin/gallery" },
  { title: "NGƯỜI DÙNG", href: "/admin/users" },
  { title: "POP-UP", href: "/admin/popup" },
  { title: "NHẬT KÝ", href: "/admin/logs" },
  { title: "CÀI ĐẶT", href: "/admin/settings" },
] as const;
