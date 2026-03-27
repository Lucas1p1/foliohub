"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2, ExternalLink, LayoutDashboard,
  LogOut, Package, Settings, User, Briefcase, Globe,
  X, Menu, ChevronRight,
} from "lucide-react";
import { cn, getInitials, getAvatarUrl } from "@/lib/utils";
import { signOut } from "@/app/(auth)/actions";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

interface SidebarProfile {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: string;
  is_published: boolean;
}

const navItems = [
  { href: "/dashboard",           label: "Overview",  icon: LayoutDashboard },
  { href: "/dashboard/profile",   label: "Profile",   icon: User },
  { href: "/dashboard/projects",  label: "Projects",  icon: Package },
  { href: "/dashboard/services",  label: "Services",  icon: Briefcase },
  { href: "/dashboard/pages",     label: "Pages",     icon: Globe,    proOnly: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings",  label: "Settings",  icon: Settings },
];

// Primary tabs shown in the bottom bar (thumb-friendly, most used)
const primaryTabs = [
  { href: "/dashboard",           label: "Home",     icon: LayoutDashboard },
  { href: "/dashboard/profile",   label: "Profile",  icon: User },
  { href: "/dashboard/projects",  label: "Projects", icon: Package },
  { href: "/dashboard/analytics", label: "Stats",    icon: BarChart2 },
];

export function DashboardSidebar({ profile }: { profile: SidebarProfile | null }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ═══════════════════════════════════════════
          DESKTOP SIDEBAR  (hidden on mobile)
      ═══════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col"
        style={{
          width: 230,
          minHeight: "100vh",
          background: "#050505",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          position: "sticky",
          top: 0,
          fontFamily: "'DM Sans', -apple-system, sans-serif",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", display: "flex", alignItems: "center", gap: 8 }}>
          <Image src="/logo1.png" alt="" width={22} height={22} style={{ objectFit: "contain" }} />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#fff", letterSpacing: "-0.03em", fontStyle: "italic" }}>
            {APP_NAME}
          </span>
        </div>

        {/* Profile strip */}
        {profile && (
          <div style={{ padding: "0 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, color: "#555", flexShrink: 0,
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
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 10px", borderRadius: 7, fontSize: 13,
                  color: active ? "#fff" : "#444",
                  textDecoration: "none",
                  background: active ? "rgba(255,255,255,0.07)" : "transparent",
                  transition: "all 150ms", marginBottom: 1,
                  letterSpacing: "0.01em", fontWeight: active ? 400 : 300,
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
              style={{ display: "block", textAlign: "center", padding: "8px 0", background: "rgba(255,255,255,0.06)", color: "#aaa", textDecoration: "none", fontSize: 12, letterSpacing: "0.04em", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)" }}
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

      {/* ═══════════════════════════════════════════
          MOBILE BOTTOM TAB BAR  (hidden on desktop)
      ═══════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{
          background: "rgba(5,5,5,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          height: "calc(60px + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {primaryTabs.map(item => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                color: active ? "#fff" : "#3a3a3a",
                transition: "color 150ms",
                minWidth: 0,
                padding: "8px 4px 6px",
              }}
            >
              <item.icon size={21} strokeWidth={active ? 2 : 1.5} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 9, letterSpacing: "0.06em", fontFamily: "'Syne', sans-serif", fontWeight: 600, textTransform: "uppercase", lineHeight: 1 }}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More button — opens drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            background: "none",
            border: "none",
            color: drawerOpen ? "#fff" : "#3a3a3a",
            transition: "color 150ms",
            padding: "8px 4px 6px",
            cursor: "pointer",
          }}
        >
          <Menu size={21} strokeWidth={1.5} />
          <span style={{ fontSize: 9, letterSpacing: "0.06em", fontFamily: "'Syne', sans-serif", fontWeight: 600, textTransform: "uppercase", lineHeight: 1 }}>
            More
          </span>
        </button>
      </nav>

      {/* ═══════════════════════════════════════════
          MOBILE DRAWER  (slides up from bottom)
      ═══════════════════════════════════════════ */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 z-[70]"
            style={{
              background: "#0a0a0a",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px 16px 0 0",
              paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
              fontFamily: "'DM Sans', -apple-system, sans-serif",
            }}
          >
            {/* Handle + header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {profile && (
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)",
                    overflow: "hidden", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, color: "#555", flexShrink: 0,
                  }}>
                    {profile.avatar_url
                      ? <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : getInitials(profile.full_name ?? profile.username)
                    }
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 13, color: "#e8e8e8", fontWeight: 400 }}>{profile?.full_name ?? profile?.username}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: profile?.is_published ? "#4ade80" : "#2e2e2e", boxShadow: profile?.is_published ? "0 0 6px rgba(74,222,128,0.4)" : "none" }} />
                    <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
                      {profile?.is_published ? "LIVE" : "DRAFT"}
                    </span>
                    {profile?.plan === "pro" && (
                      <span style={{ fontSize: 9, background: "rgba(255,255,255,0.08)", color: "#aaa", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.06em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>PRO</span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", color: "#666" }}>
                <X size={16} />
              </button>
            </div>

            {/* View live page link */}
            {profile && (
              <a
                href={`${APP_URL}/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  margin: "0 16px 8px",
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "#888",
                  fontSize: 13,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ExternalLink size={14} />
                  View my live page
                </span>
                <ChevronRight size={14} style={{ color: "#333" }} />
              </a>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />

            {/* All nav items */}
            <div style={{ padding: "4px 12px" }}>
              {navItems.map(item => {
                const active = pathname === item.href;
                const isLocked = item.proOnly && profile?.plan !== "pro";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "13px 10px",
                      borderRadius: 8,
                      textDecoration: "none",
                      color: active ? "#fff" : "#555",
                      background: active ? "rgba(255,255,255,0.05)" : "transparent",
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
                      <item.icon size={16} style={{ opacity: active ? 1 : 0.5 }} />
                      {item.label}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {isLocked && (
                        <span style={{ fontSize: 9, background: "rgba(255,193,7,0.15)", color: "#f59e0b", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.06em", fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>PRO</span>
                      )}
                      {active && <ChevronRight size={14} style={{ color: "#444" }} />}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />

            {/* Upgrade CTA (free users only) */}
            {profile?.plan === "free" && (
              <Link
                href="/dashboard/settings"
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  margin: "4px 16px 4px",
                  padding: "13px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "#aaa",
                  fontSize: 13,
                }}
              >
                <span>Upgrade to Pro — ₦5000/mo</span>
                <ChevronRight size={14} style={{ color: "#444" }} />
              </Link>
            )}

            {/* Sign out */}
            <form action={signOut} style={{ padding: "4px 16px 0" }}>
              <button
                type="submit"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "13px 10px",
                  background: "none", border: "none", borderRadius: 8,
                  fontSize: 14, color: "#3a3a3a", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <LogOut size={16} style={{ opacity: 0.5 }} />
                Sign out
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}