"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const TEMPLATES = [
  { id: 1, name: "Noir",       description: "Dark editorial, gold accents",        preview: "bg-gradient-to-br from-neutral-950 to-neutral-900", free: true },
  { id: 2, name: "Magazine",   description: "Light, typographic, editorial",         preview: "bg-gradient-to-br from-stone-100 to-stone-50",    free: false },
  { id: 3, name: "Atelier",    description: "Warm sidebar, structured layout",       preview: "bg-gradient-to-br from-stone-200 to-amber-50",    free: false },
];

interface Props {
  profile: Profile;
  userId: string;
  userEmail: string;
  justUpgraded: boolean;
}

export function SettingsClient({ profile, userId, userEmail, justUpgraded }: Props) {
  const { toast } = useToast();
  const [templateId, setTemplateId] = useState(profile.template_id);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (justUpgraded) {
      toast({ title: "Welcome to Pro ✦", description: "All features are now unlocked." });
    }
  }, [justUpgraded, toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "payment_failed") {
      toast({ title: "Payment failed", description: "Your payment didn't go through. Please try again.", variant: "destructive" });
    }
  }, [toast]);

  async function saveTemplate(id: number) {
    if (profile.plan === "free" && id !== 1) {
      toast({ title: "Pro required", description: "Upgrade to unlock all templates.", variant: "destructive" });
      return;
    }
    setTemplateId(id as 1 | 2 | 3);
    setSavingTemplate(true);
    await supabase.from("profiles").update({ template_id: id }).eq("id", userId);
    setSavingTemplate(false);
    toast({ title: "Template saved" });
  }

  async function handleUpgrade() {
    setBillingLoading(true);
    const res = await fetch("/api/paystack/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email: userEmail }),
    });
    const { url, error, alreadyPro } = await res.json();
    if (alreadyPro) {
      toast({ title: "Already on Pro", description: "Your subscription is active." });
      setBillingLoading(false);
      return;
    }
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      setBillingLoading(false);
      return;
    }
    window.location.href = url;
  }

  async function handleCancel() {
    if (!confirm("Cancel your Pro subscription? You'll be moved to the free plan immediately.")) return;
    setCancelLoading(true);
    const res = await fetch("/api/paystack/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email: userEmail, action: "cancel" }),
    });
    const { cancelled, error } = await res.json();
    if (error) {
      toast({ title: "Error cancelling", description: error, variant: "destructive" });
    } else if (cancelled) {
      toast({ title: "Subscription cancelled", description: "Moved to the free plan." });
      window.location.reload();
    }
    setCancelLoading(false);
  }

  return (
    <div className="space-y-5">

      {/* Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Plan</CardTitle>
              <CardDescription>Your current subscription</CardDescription>
            </div>
            <Badge variant={profile.plan === "pro" ? "pro" : "secondary"}>
              {profile.plan === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {profile.plan === "pro" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                All features unlocked — analytics, all templates, no branding
              </div>
              <Button
                variant="outline" size="sm"
                onClick={handleCancel} disabled={cancelLoading}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-3.5 w-3.5" />}
                Cancel subscription
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card/50 p-5 space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Upgrade to Pro — ₦5000/month</div>
                <ul className="space-y-1.5 text-sm text-muted-foreground mt-3">
                  {[
                    "Analytics — views, clicks, conversion rate",
                    "All 3 templates unlocked",
                    "No Introhub branding",
                    "Cancel anytime",
                  ].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-foreground/10 flex items-center justify-center text-[9px] text-foreground/60">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button onClick={handleUpgrade} disabled={billingLoading} size="sm">
                {billingLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Upgrade to Pro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template picker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Template</CardTitle>
          <CardDescription>Choose how your public page looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            {TEMPLATES.map((t) => {
              const locked = !t.free && profile.plan === "free";
              const active = templateId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => saveTemplate(t.id)}
                  disabled={savingTemplate}
                  className={cn(
                    "relative rounded-xl border-2 p-3 text-left transition-all hover:shadow-md",
                    active ? "border-foreground/40" : "border-border hover:border-muted-foreground/40",
                    locked && "opacity-50"
                  )}
                >
                  <div className={cn("h-20 rounded-lg mb-3 overflow-hidden", t.preview)}>
                    <div className="p-3 flex flex-col gap-1.5 h-full">
                      <div className="w-7 h-7 rounded-full bg-white/15" />
                      <div className="h-1.5 w-14 bg-white/20 rounded" />
                      <div className="h-1 w-10 bg-white/12 rounded" />
                    </div>
                    {locked && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg mt-0 top-3 left-3 right-3 bottom-3">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium">{t.name}</span>
                    {active && <CheckCircle className="h-3.5 w-3.5 text-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                  {locked && (
                    <span className="absolute top-2 right-2 text-[9px] bg-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded font-medium" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "0.06em" }}>PRO</span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-base text-destructive/70">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Deleting your account is permanent and cannot be undone.</p>
          <Button variant="destructive" size="sm" disabled>Delete account</Button>
          <p className="text-xs text-muted-foreground mt-2">Contact support to delete your account.</p>
        </CardContent>
      </Card>
    </div>
  );
}