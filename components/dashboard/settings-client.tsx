"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2, ExternalLink, Sparkles, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const TEMPLATES = [
  {
    id: 1,
    name: "Developer",
    description: "Clean technical layout with project grid",
    preview: "bg-gradient-to-br from-slate-900 to-slate-800",
    accent: "bg-blue-500",
    free: true,
  },
  {
    id: 2,
    name: "Freelancer",
    description: "Service-focused with bold hero section",
    preview: "bg-gradient-to-br from-orange-50 to-amber-50",
    accent: "bg-orange-500",
    free: false,
  },
  {
    id: 3,
    name: "Minimal CV",
    description: "Typography-first, elegant and clean",
    preview: "bg-gradient-to-br from-gray-50 to-gray-100",
    accent: "bg-gray-800",
    free: false,
  },
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
      toast({ title: "Welcome to Pro! ⚡", description: "All Pro features are now unlocked." });
    }
  }, [justUpgraded, toast]);

  // Check for error param in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "payment_failed") {
      toast({ title: "Payment failed", description: "Your payment didn't go through. Please try again.", variant: "destructive" });
    }
  }, [toast]);

  async function saveTemplate(id: number) {
    if (profile.plan === "free" && id !== 1) {
      toast({ title: "Pro required", description: "Upgrade to use this template.", variant: "destructive" });
      return;
    }
    setTemplateId(id as 1 | 2 | 3);
    setSavingTemplate(true);
    await supabase.from("profiles").update({ template_id: id }).eq("id", userId);
    setSavingTemplate(false);
    toast({ title: "Template saved ✓" });
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
      toast({ title: "You're already on Pro!", description: "Your subscription is active." });
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
    if (!confirm("Are you sure you want to cancel your Pro subscription? You'll be downgraded to the free plan immediately.")) return;
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
      toast({ title: "Subscription cancelled", description: "You've been moved to the free plan." });
      // Reload to reflect new plan
      window.location.reload();
    }
    setCancelLoading(false);
  }

  return (
    <div className="space-y-6">

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
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={cancelLoading}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-3.5 w-3.5" />}
                Cancel subscription
              </Button>
              <p className="text-xs text-muted-foreground">
                To update your card or view payment history, contact Paystack support or your bank.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-sm">Upgrade to Pro — $7/month</span>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    "Analytics dashboard — see page views & clicks",
                    "All 3 templates unlocked",
                    "No FolioHub branding on your page",
                    "Cancel anytime",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center text-[10px]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={handleUpgrade} disabled={billingLoading} className="w-full sm:w-auto">
                  {billingLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Upgrade to Pro
                </Button>
              </div>
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
                    active ? "border-foreground" : "border-border hover:border-muted-foreground",
                    locked && "opacity-60"
                  )}
                >
                  <div className={cn("h-20 rounded-lg mb-3 overflow-hidden relative", t.preview)}>
                    <div className="absolute inset-0 p-2 flex flex-col gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                      <div className="h-1.5 w-16 bg-white/30 rounded" />
                      <div className="h-1 w-12 bg-white/20 rounded" />
                      <div className="flex gap-1 mt-auto">
                        <div className="h-6 w-full bg-white/10 rounded" />
                        <div className="h-6 w-full bg-white/10 rounded" />
                      </div>
                    </div>
                    {locked && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-lg">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium">{t.name}</span>
                    {active && <CheckCircle className="h-4 w-4 text-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                  {locked && (
                    <span className="absolute top-2 right-2 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-semibold">Pro</span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Deleting your account is permanent and cannot be undone.
          </p>
          <Button variant="destructive" size="sm" disabled>
            Delete account
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Contact support to delete your account.</p>
        </CardContent>
      </Card>
    </div>
  );
}