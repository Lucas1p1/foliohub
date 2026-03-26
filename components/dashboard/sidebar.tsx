"use client";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2, ExternalLink, LayoutDashboard,
  LogOut, Package, Settings, Sparkles, User, Briefcase, Globe,
} from "lucide-react";
import { cn, getInitials, getAvatarUrl } from "@/lib/utils";
import { signOut } from "@/app/(auth)/actions";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

interface SidebarProfile {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: string;
  is_published: boolean;
}

const navItems = [
  { href: "/dashboard",            label: "Overview",   icon: LayoutDashboard },
  { href: "/dashboard/profile",    label: "Profile",    icon: User },
  { href: "/dashboard/projects",   label: "Projects",   icon: Package },
  { href: "/dashboard/services",   label: "Services",   icon: Briefcase },
  { href: "/dashboard/pages",      label: "Pages",      icon: Globe,    proOnly: true },
  { href: "/dashboard/analytics",  label: "Analytics",  icon: BarChart2 },
  { href: "/dashboard/settings",   label: "Settings",   icon: Settings },
];

export function DashboardSidebar({ profile }: { profile: SidebarProfile | null }) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 230,
      minHeight: "100vh",
      background: "#050505",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <Image src="/logo1.png" alt="" width={22} height={22} style={{ objectFit: "contain" }} />
  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#fff", letterSpacing: "-0.03em", fontStyle: "italic" }}>
    {APP_NAME}
  </span>
</div>

      {/* Profile strip */}
      {profile && (
        <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, color: "#555", flexShrink: 0, fontWeight: 400,
            }}>
              {profile.avatar_url
                ? <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : getInitials(profile.full_name ?? profile.username)
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "#e8e8e8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 400 }}>
                {profile.full_name ?? profile.username}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: profile.is_published ? "#4ade80" : "#2e2e2e", flexShrink: 0, boxShadow: profile.is_published ? "0 0 6px rgba(74,222,128,0.4)" : "none" }} />
                <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
                  {profile.is_published ? "LIVE" : "DRAFT"}
                </span>
                {profile.plan === "pro" && (
                  <span style={{ fontSize: 9, background: "rgba(255,255,255,0.08)", color: "#aaa", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.06em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>PRO</span>
                )}
              </div>
            </div>
          </div>

          <a href={`${APP_URL}/${profile.username}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 14, fontSize: 10, color: "#2a2a2a", textDecoration: "none", letterSpacing: "0.06em", transition: "color 150ms", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#666")}
            onMouseLeave={e => (e.currentTarget.style.color = "#2a2a2a")}>
            <ExternalLink size={9} />
            VIEW MY PAGE
          </a>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 12px" }}>
        {navItems.map(item => {
          const active = pathname === item.href;
          const isLocked = item.proOnly && profile?.plan !== "pro";
          return (
            <Link key={item.href} href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 7,
                fontSize: 13,
                color: active ? "#fff" : "#444",
                textDecoration: "none",
                background: active ? "rgba(255,255,255,0.07)" : "transparent",
                transition: "all 150ms",
                marginBottom: 1,
                letterSpacing: "0.01em",
                fontWeight: active ? 400 : 300,
                border: active ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#bbb"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#444"; }}
            >
              <item.icon size={14} style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }} />
              {item.label}
              {isLocked && (
                <span style={{ marginLeft: "auto", fontSize: 9, background: "rgba(255,255,255,0.05)", color: "#555", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.06em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>PRO</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      {profile?.plan === "free" && (
        <div style={{ margin: "0 14px 14px", padding: "16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, background: "rgba(255,255,255,0.02)" }}>
          <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>UPGRADE TO PRO</div>
          <div style={{ fontSize: 12, color: "#3a3a3a", lineHeight: 1.6, marginBottom: 14, fontWeight: 300 }}>Analytics, all templates, multiple pages</div>
          <Link href="/dashboard/settings"
            style={{ display: "block", textAlign: "center", padding: "8px 0", background: "rgba(255,255,255,0.06)", color: "#aaa", textDecoration: "none", fontSize: 12, letterSpacing: "0.04em", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", transition: "background 150ms, color 150ms" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}>
            ₦5000 / month →
          </Link>
        </div>
      )}

      {/* Sign out */}
      <form action={signOut} style={{ padding: "0 12px 18px" }}>
        <button type="submit"
          style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, padding: "9px 10px", background: "none", border: "none", borderRadius: 7, fontSize: 13, color: "#2e2e2e", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.01em", transition: "color 150ms", fontWeight: 300 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#666")}
          onMouseLeave={e => (e.currentTarget.style.color = "#2e2e2e")}>
          <LogOut size={14} />
          Sign out
        </button>
      </form>
    </aside>
  );
}