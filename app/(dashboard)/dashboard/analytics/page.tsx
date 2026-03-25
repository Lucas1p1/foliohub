import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (profile?.plan !== "pro") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">See who's viewing your page</p>
        </div>
        <div className="rounded-xl border bg-card p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Analytics is a Pro feature</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Upgrade to Pro to see your page views, WhatsApp clicks, and contact click trends.
          </p>
          <Button asChild>
            <Link href="/dashboard/settings">Upgrade to Pro — $7/mo</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch analytics data
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalViews },
    { count: waClicks },
    { count: emailClicks },
    { count: viewsThisWeek },
    { count: viewsLastWeek },
    { data: recentEvents },
  ] = await Promise.all([
    supabase.from("page_events").select("*", { count: "exact", head: true }).eq("profile_id", user.id).eq("event_type", "page_view"),
    supabase.from("page_events").select("*", { count: "exact", head: true }).eq("profile_id", user.id).eq("event_type", "whatsapp_click"),
    supabase.from("page_events").select("*", { count: "exact", head: true }).eq("profile_id", user.id).eq("event_type", "email_click"),
    supabase.from("page_events").select("*", { count: "exact", head: true }).eq("profile_id", user.id).eq("event_type", "page_view").gte("created_at", weekAgo),
    supabase.from("page_events").select("*", { count: "exact", head: true }).eq("profile_id", user.id).eq("event_type", "page_view").gte("created_at", twoWeeksAgo).lt("created_at", weekAgo),
    supabase.from("page_events").select("event_type, created_at").eq("profile_id", user.id).order("created_at", { ascending: false }).limit(20),
  ]);

  const weekChange = viewsLastWeek === 0
    ? viewsThisWeek! > 0 ? "+100%" : "0%"
    : `${viewsThisWeek! > viewsLastWeek! ? "+" : ""}${Math.round(((viewsThisWeek! - viewsLastWeek!) / viewsLastWeek!) * 100)}%`;

  const conversionRate = totalViews === 0 ? 0 : Math.round(((waClicks! + emailClicks!) / totalViews!) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">How your page is performing</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total views", value: formatNumber(totalViews ?? 0) },
          { label: "This week", value: formatNumber(viewsThisWeek ?? 0), sub: weekChange },
          { label: "WhatsApp clicks", value: formatNumber(waClicks ?? 0) },
          { label: "Conversion rate", value: `${conversionRate}%` },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              {s.sub && <p className={`text-xs mt-0.5 ${s.sub.startsWith("+") ? "text-green-600" : s.sub === "0%" ? "text-muted-foreground" : "text-destructive"}`}>{s.sub} vs last week</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentEvents?.length ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No activity yet — share your page to get visitors!</p>
          ) : (
            <div className="space-y-2">
              {recentEvents.map((e, i) => {
                const labels: Record<string, string> = {
                  page_view: "👁 Page view",
                  whatsapp_click: "💬 WhatsApp click",
                  email_click: "✉️ Email click",
                  github_click: "🐙 GitHub click",
                  live_url_click: "🔗 Live URL click",
                };
                const date = new Date(e.created_at);
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm">{labels[e.event_type] ?? e.event_type}</span>
                    <span className="text-xs text-muted-foreground">
                      {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
