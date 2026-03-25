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
    <div className="min-h-screen flex bg-muted/30">
      <DashboardSidebar profile={profile} />
      <main className="flex-1 min-w-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
