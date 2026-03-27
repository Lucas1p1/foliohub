import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart2, Eye, MessageCircle, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { PublishToggle } from "@/components/dashboard/publish-toggle";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: projects }, { count: viewCount }, { count: waCount }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("projects").select("id").eq("profile_id", user.id),
      supabase.from("page_events").select("*", { count: "exact", head: true })
        .eq("profile_id", user.id).eq("event_type", "page_view"),
      supabase.from("page_events").select("*", { count: "exact", head: true })
        .eq("profile_id", user.id).eq("event_type", "whatsapp_click"),
    ]);

  if (!profile) redirect("/login");

  const completionItems = [
    { label: "Profile photo", done: !!profile.avatar_url },
    { label: "Headline", done: !!profile.headline },
    { label: "Bio", done: !!profile.bio },
    { label: "WhatsApp number", done: !!profile.whatsapp },
    { label: "At least 1 project", done: (projects?.length ?? 0) > 0 },
  ];
  const completionPct = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  );

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {profile.is_published
            ? `Welcome`
            : ""}
        </p>
      </div>

      {/* Publish toggle card */}
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="font-medium">Page status</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {profile.is_published ? "Visible to everyone" : "Only you can see it"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${profile.is_published ? "text-green-600" : "text-muted-foreground"}`}>
              {profile.is_published ? "Live" : "Draft"}
            </span>
            <PublishToggle profileId={user.id} isPublished={profile.is_published} />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Page views", value: viewCount ?? 0, icon: Eye },
          { label: "WhatsApp clicks", value: waCount ?? 0, icon: MessageCircle },
          { label: "Projects", value: projects?.length ?? 0, icon: Package },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{formatNumber(s.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile completion */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile completion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-foreground h-2 rounded-full transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-sm font-medium w-10 text-right">{completionPct}%</span>
          </div>
          <div className="space-y-2">
            {completionItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-sm">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  item.done ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                }`}>
                  {item.done ? "✓" : ""}
                </span>
                <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          {completionPct < 100 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/profile">
                Complete profile <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/dashboard/projects" className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Manage projects</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link href="/dashboard/analytics" className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">View analytics</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
