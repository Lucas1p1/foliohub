"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2, ExternalLink, LayoutDashboard,
  LogOut, Package, Settings, Sparkles, User, Briefcase, Globe,
} from "lucide-react";
import { cn, getInitials, getAvatarUrl } from "@/lib/utils";
import { signOut } from "@/app/(auth)/actions";
import { Badge } from "@/components/ui/card";

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
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/projects", label: "Projects", icon: Package },
  { href: "/dashboard/services", label: "Services", icon: Briefcase },
  { href: "/dashboard/pages", label: "Pages", icon: Globe, proOnly: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ profile }: { profile: SidebarProfile | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border">
        <span className="font-semibold">{APP_NAME}</span>
      </div>

      {/* Profile preview */}
      {profile && (
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted overflow-hidden flex items-center justify-center text-sm font-medium shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" className="w-full h-full object-cover" />
              ) : (
                getInitials(profile.full_name ?? profile.username)
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{profile.full_name ?? profile.username}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", profile.is_published ? "bg-green-500" : "bg-muted-foreground")} />
                <span className="text-xs text-muted-foreground">
                  {profile.is_published ? "Live" : "Draft"}
                </span>
                {profile.plan === "pro" && (
                  <Badge variant="pro" className="text-[10px] px-1.5 py-0">Pro</Badge>
                )}
              </div>
            </div>
          </div>
          <a
            href={`${APP_URL}/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            View my page
          </a>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const isLocked = item.proOnly && profile?.plan !== "pro";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {isLocked && (
                <span className="ml-auto text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-semibold">Pro</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA for free users */}
      {profile?.plan === "free" && (
        <div className="mx-3 mb-3 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mb-2">Analytics, all templates, multiple pages</p>
          <Link
            href="/dashboard/settings"
            className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
          >
            Upgrade for $7/mo →
          </Link>
        </div>
      )}

      {/* Sign out */}
      <form action={signOut} className="px-3 pb-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
    </aside>
  );
}