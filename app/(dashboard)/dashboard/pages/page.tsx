import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PagesManager } from "@/components/dashboard/pages-manager";

export const metadata = { title: "Pages" };

export default async function PagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  // Pro-only feature
  if (profile?.plan !== "pro") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground text-sm mt-1">Create multiple pages for different services</p>
        </div>
        <div className="rounded-xl border bg-card p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Multiple pages is a Pro feature</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Upgrade to Pro to create up to 5 pages — each with their own URL, projects, services, and template. Up to 2 can be live at once.
          </p>
          <Button asChild>
            <Link href="/dashboard/settings">Upgrade to Pro</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch all pages with their projects and services
  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at");

  const pageIds = (pages ?? []).map((p) => p.id);

  const [{ data: allProjects }, { data: allServices }] = await Promise.all([
    pageIds.length > 0
      ? supabase.from("projects").select("*").in("page_id", pageIds).order("order_index")
      : Promise.resolve({ data: [] }),
    pageIds.length > 0
      ? supabase.from("services").select("*").in("page_id", pageIds).order("order_index")
      : Promise.resolve({ data: [] }),
  ]);

  // Attach projects and services to each page
  const pagesWithData = (pages ?? []).map((page) => ({
    ...page,
    projects: (allProjects ?? []).filter((p) => p.page_id === page.id),
    services: (allServices ?? []).filter((s) => s.page_id === page.id),
  }));

  const publishedCount = pagesWithData.filter((p) => p.is_published).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create up to 5 pages, each with its own URL and content · Up to 2 can be live at once
        </p>
      </div>
      <PagesManager
        pages={pagesWithData}
        userId={user.id}
        userPlan={profile.plan as "free" | "pro"}
        publishedCount={publishedCount}
      />
    </div>
  );
}