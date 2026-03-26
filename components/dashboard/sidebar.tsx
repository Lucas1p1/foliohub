"use client";

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
      width: 220,
      minHeight: "100vh",
      background: "#0a0a0a",
      borderRight: "1px solid #1c1c1c",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      fontFamily: "'DM Mono', monospace",
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid #1c1c1c" }}>
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }}>
          {APP_NAME}
        </span>
      </div>

      {/* Profile strip */}
      {profile && (
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1c1c1c" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Avatar */}
            <div style={{ width: 28, height: 28, borderRadius: 4, background: "#1c1c1c", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#888", flexShrink: 0 }}>
              {profile.avatar_url
                ? <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : getInitials(profile.full_name ?? profile.username)
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "#e8e8e8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile.full_name ?? profile.username}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: profile.is_published ? "#e8ff47" : "#3a3a3a", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.04em" }}>
                  {profile.is_published ? "LIVE" : "DRAFT"}
                </span>
                {profile.plan === "pro" && (
                  <span style={{ fontSize: 9, background: "rgba(232,255,71,0.1)", color: "#e8ff47", padding: "1px 6px", borderRadius: 2, letterSpacing: "0.06em" }}>PRO</span>
                )}
              </div>
            </div>
          </div>

          <a href={`${APP_URL}/${profile.username}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 12, fontSize: 10, color: "#3a3a3a", textDecoration: "none", letterSpacing: "0.04em", transition: "color 150ms" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#888")}
            onMouseLeave={e => (e.currentTarget.style.color = "#3a3a3a")}>
            <ExternalLink size={10} />
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
                padding: "9px 8px",
                borderRadius: 4,
                fontSize: 12,
                color: active ? "#e8ff47" : "#555",
                textDecoration: "none",
                background: active ? "rgba(232,255,71,0.06)" : "transparent",
                transition: "all 150ms",
                marginBottom: 1,
                letterSpacing: "0.02em",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#e8e8e8"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#555"; }}
            >
              <item.icon size={14} style={{ flexShrink: 0 }} />
              {item.label}
              {isLocked && (
                <span style={{ marginLeft: "auto", fontSize: 9, background: "rgba(232,255,71,0.1)", color: "#e8ff47", padding: "1px 5px", borderRadius: 2, letterSpacing: "0.06em" }}>PRO</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA (free users) */}
      {profile?.plan === "free" && (
        <div style={{ margin: "0 12px 12px", padding: "14px 14px", border: "1px solid #2a2a2a", borderRadius: 4, background: "#0d0d0d" }}>
          <div style={{ fontSize: 10, color: "#e8ff47", letterSpacing: "0.08em", marginBottom: 6 }}>UPGRADE TO PRO</div>
          <div style={{ fontSize: 11, color: "#555", lineHeight: 1.6, marginBottom: 12 }}>Analytics, all templates, multiple pages</div>
          <Link href="/dashboard/settings"
            style={{ display: "block", textAlign: "center", padding: "8px 0", background: "rgba(232,255,71,0.1)", color: "#e8ff47", textDecoration: "none", fontSize: 11, letterSpacing: "0.04em", borderRadius: 3, border: "1px solid rgba(232,255,71,0.15)", transition: "background 150ms" }}>
            $7 / month →
          </Link>
        </div>
      )}

      {/* Sign out */}
      <form action={signOut} style={{ padding: "0 12px 16px" }}>
        <button type="submit"
          style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, padding: "9px 8px", background: "none", border: "none", borderRadius: 4, fontSize: 12, color: "#3a3a3a", cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: "0.02em", transition: "color 150ms" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#888")}
          onMouseLeave={e => (e.currentTarget.style.color = "#3a3a3a")}>
          <LogOut size={14} />
          Sign out
        </button>
      </form>
    </aside>
  );
}