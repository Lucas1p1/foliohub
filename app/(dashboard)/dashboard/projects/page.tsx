import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectsManager } from "@/components/dashboard/projects-manager";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("profile_id", user.id)
    .order("order_index");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground text-sm mt-1">Showcase your best work — up to 12 projects</p>
      </div>
      <ProjectsManager projects={projects ?? []} userId={user.id} />
    </div>
  );
}
