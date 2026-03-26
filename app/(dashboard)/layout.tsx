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
    <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0a", fontFamily: "'DM Mono', monospace" }}>
      <DashboardSidebar profile={profile} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}