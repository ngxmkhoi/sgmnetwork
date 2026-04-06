import Link from "next/link";
import Image from "next/image";
import {
  FacebookBrandIcon,
  GmailBrandIcon,
  TiktokBrandIcon,
  YoutubeBrandIcon,
} from "@/components/common/brand-icons";
import { getSettings } from "@/lib/data/content-service";
import { siteConfig } from "@/lib/constants/site";
import { buildSettingsMap, resolveSocialLinks } from "@/lib/utils/site-settings";

const LOGO_LIGHT = "https://ik.imagekit.io/oyvgbkwyt/SGM%20NETWORK/29032026/b21232026.png?updatedAt=1774797861035";
const LOGO_DARK = "https://ik.imagekit.io/oyvgbkwyt/SGM%20NETWORK/29032026/w21232026.png?updatedAt=1774797861441";

const footerNav = [
  { label: "Trang Chủ", href: "/" },
  { label: "Lịch", href: "/calendar" },
  { label: "Sự Kiện", href: "/events" },
  { label: "Phát Trực Tiếp", href: "/esports" },
  { label: "Tin Tức", href: "/news" },
  { label: "Liên Hệ", href: "/contact" },
];

const footerLegal = [
  { label: "Chính Sách Bảo Mật", href: "/privacy-policy" },
  { label: "Điều Khoản Sử Dụng", href: "/terms-of-use" },
];

export async function SiteFooter() {
  const settingsMap = buildSettingsMap(await getSettings());
  const resolvedSocialLinks = resolveSocialLinks(settingsMap);

  const socialLinks = [
    { label: "Facebook", href: resolvedSocialLinks.facebook, icon: FacebookBrandIcon },
    { label: "TikTok", href: resolvedSocialLinks.tiktok, icon: TiktokBrandIcon },
    ...(resolvedSocialLinks.youtube && resolvedSocialLinks.youtube !== "https://youtube.com"
      ? [{ label: "YouTube", href: resolvedSocialLinks.youtube, icon: YoutubeBrandIcon }]
      : []),
    {
      label: "Gmail",
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(resolvedSocialLinks.email)}`,
      icon: GmailBrandIcon,
    },
  ];

  return (
    <footer className="relative mt-16 border-t border-border bg-card">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 dark:via-amber-400/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-12">

          {/* Cột 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 -ml-2">
              <Image src={LOGO_LIGHT} alt="SGM Network" width={52} height={52} className="block rounded-xl dark:hidden shrink-0" />
              <Image src={LOGO_DARK} alt="SGM Network" width={52} height={52} className="hidden rounded-xl dark:block shrink-0" />
              <div className="flex flex-col -ml-1" style={{ lineHeight: 1.15 }}>
                <span className="font-heading text-2xl font-black uppercase text-foreground">SGM</span>
                <span className="font-heading text-2xl font-black uppercase text-foreground">NETWORK</span>
              </div>
            </div>
            <p className="text-sm leading-6 text-muted-foreground max-w-[280px] text-justify">
              {settingsMap["site.description"] ?? siteConfig.description}
            </p>
          </div>

          {/* Cột 2: Điều hướng */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold uppercase tracking-widest text-foreground">Điều Hướng</p>
            <ul className="flex flex-col gap-2">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Pháp lý */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold uppercase tracking-widest text-foreground">Pháp Lý</p>
            <ul className="flex flex-col gap-2">
              {footerLegal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold uppercase tracking-widest text-foreground">Liên Hệ</p>
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Email</p>
                <p className="text-sm text-muted-foreground">{resolvedSocialLinks.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Website</p>
                <p className="text-sm text-muted-foreground">{siteConfig.url.replace("https://", "")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground transition hover:bg-primary hover:text-white dark:hover:bg-amber-400 dark:hover:text-black"
                  >
                    <Icon className="size-[18px]" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-border" />

        {/* Copyright */}
        <div className="mt-4 flex flex-col items-center gap-1 text-center">
          <p className="text-[15px] font-bold text-foreground">
            © 2026 SGM Network. All Rights Reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            All images and related assets are the property of Garena Free Fire Vietnam.
          </p>
        </div>

      </div>
    </footer>
  );
}
