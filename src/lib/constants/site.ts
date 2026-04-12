export const siteConfig = {
  name: "SGM Network - Trang Tin Tức Cộng Đồng Free Fire",
  shortName: "SGM Network",
  description:
    "SGM Network – Cổng thông tin cộng đồng Free Fire hàng đầu. Cập nhật nhanh nhất các sự kiện in-game, tin tức Esports chuyên sâu và các hoạt động cộng đồng nổi bật. Trang độc lập, khách quan, được vận hành và phát triển bởi đội ngũ SGM Network.",
  url: "https://sgmnetwork.vercel.app",
  productionUrl: "https://sgmnetwork.vercel.app",
  ogImage: "/og-image.png",
  favicon: "https://ik.imagekit.io/oyvgbkwyt/SGM%20NETWORK/29032026/b21232026.png?updatedAt=1774797861035",
  sidebarIcon: "https://ik.imagekit.io/oyvgbkwyt/SGM%20NETWORK/29032026/b21232026.png?updatedAt=1774797861035",
  links: {
    community: "https://zalo.me/g/pqlkhq011",
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
  { title: "ĐÁNH GIÁ", href: "/admin/ratings" },
  { title: "NHẬT KÝ", href: "/admin/logs" },
  { title: "CÀI ĐẶT", href: "/admin/settings" },
] as const;
