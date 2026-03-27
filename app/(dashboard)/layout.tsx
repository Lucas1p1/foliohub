import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url, plan, is_published")
    .eq("id", user.id)
    .single();

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#050505", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <DashboardSidebar profile={profile} />

      {/* Main content area */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/*
          Mobile: pad top for the status bar area and bottom for the tab bar.
          Desktop: no extra top padding needed (sidebar handles vertical flow).
        */}
        <div
          className="lg:hidden"
          style={{ height: 0 }}
          /* No top bar on mobile — sidebar is bottom-only */
        />
        <div
          style={{ maxWidth: 740, margin: "0 auto" }}
          className="
            px-4 py-6 pb-24
            lg:px-10 lg:py-[52px] lg:pb-[52px]
          "
        >
          {children}
        </div>
      </main>
    </div>
  );
}