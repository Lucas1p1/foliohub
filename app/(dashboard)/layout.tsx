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
      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "52px 40px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}