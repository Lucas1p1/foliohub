"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Sparkles, AlertCircle, Palette, Type } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

// ─── Template definitions (now visually distinct) ──────────────────────────
const TEMPLATES = [
  {
    id: 1,
    name: "Terminal",
    description: "Dark, code-editor aesthetic with project grid",
    free: true,
    preview: {
      bg: "#060606",
      text: "#e8ff47",
      card: "#0d0d0d",
      accent: "#e8ff47",
    },
  },
  {
    id: 2,
    name: "Magazine",
    description: "Bold editorial, oversized type, light theme",
    free: false,
    preview: {
      bg: "#f5f3f0",
      text: "#111",
      card: "#fff",
      accent: "#FF3B00",
    },
  },
  {
    id: 3,
    name: "Studio",
    description: "Soft gradients, centered layout, elegant cards",
    free: false,
    preview: {
      bg: "#fdfcfb",
      text: "#222",
      card: "rgba(255,255,255,0.8)",
      accent: "#7C5CFC",
    },
  },
];

// ─── Accent colour presets ─────────────────────────────────────────────────
const ACCENT_PRESETS = [
  { name: "Volt",     hex: "#e8ff47" },
  { name: "Inferno",  hex: "#FF3B00" },
  { name: "Iris",     hex: "#7C5CFC" },
  { name: "Sky",      hex: "#00B4D8" },
  { name: "Lime",     hex: "#39D353" },
  { name: "Rose",     hex: "#FF3D77" },
  { name: "Gold",     hex: "#FFB800" },
  { name: "White",    hex: "#f0f0f0" },
];

// ─── Font options ──────────────────────────────────────────────────────────
const FONT_OPTIONS = [
  { id: "mono",    name: "Mono",    sample: "Hello world.", style: "'DM Mono', monospace",           desc: "Code-like, clean" },
  { id: "serif",   name: "Serif",   sample: "Hello world.", style: "'Playfair Display', Georgia, serif", desc: "Elegant, editorial" },
  { id: "sans",    name: "Syne",    sample: "Hello world.", style: "'Syne', system-ui, sans-serif",   desc: "Modern, geometric" },
  { id: "display", name: "Grotesk", sample: "Hello world.", style: "'Space Grotesk', system-ui",     desc: "Sharp, tech" },
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

  // Appearance state
  const profileExtra = profile as Record<string, unknown>;
  const [accentColor, setAccentColor] = useState<string>((profileExtra.accent_color as string) ?? "#e8ff47");
  const [customAccent, setCustomAccent] = useState<string>((profileExtra.accent_color as string) ?? "#e8ff47");
  const [fontId, setFontId] = useState<string>((profileExtra.font_id as string) ?? "mono");
  const [savingAppearance, setSavingAppearance] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (justUpgraded) toast({ title: "Welcome to Pro ✦", description: "All features are now unlocked." });
  }, [justUpgraded, toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "payment_failed")
      toast({ title: "Payment failed", description: "Your payment didn't go through. Please try again.", variant: "destructive" });
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

  async function saveAppearance() {
    setSavingAppearance(true);
    await supabase.from("profiles").update({
      accent_color: accentColor,
      font_id: fontId,
    } as Record<string, unknown>).eq("id", userId);
    setSavingAppearance(false);
    toast({ title: "Appearance saved ✓" });
  }

  async function handleUpgrade() {
    setBillingLoading(true);
    const res = await fetch("/api/paystack/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email: userEmail }),
    });
    const { url, error, alreadyPro } = await res.json();
    if (alreadyPro) { toast({ title: "Already on Pro", description: "Your subscription is active." }); setBillingLoading(false); return; }
    if (error) { toast({ title: "Error", description: error, variant: "destructive" }); setBillingLoading(false); return; }
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
    if (error) toast({ title: "Error cancelling", description: error, variant: "destructive" });
    else if (cancelled) { toast({ title: "Subscription cancelled", description: "Moved to the free plan." }); window.location.reload(); }
    setCancelLoading(false);
  }

  return (
    <div className="space-y-5">

      {/* ── Plan ── */}
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
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={cancelLoading}
                className="text-destructive border-destructive/30 hover:bg-destructive/10">
                {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-3.5 w-3.5" />}
                Cancel subscription
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card/50 p-5 space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Upgrade to Pro — ₦5000/month</div>
                <ul className="space-y-1.5 text-sm text-muted-foreground mt-3">
                  {["Analytics — views, clicks, conversion rate", "All 3 templates unlocked", "No Introhub branding", "Cancel anytime"].map(f => (
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

      {/* ── Template picker ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Template</CardTitle>
          <CardDescription>Each template has a completely different look and layout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => {
              const locked = !t.free && profile.plan === "free";
              const active = templateId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => saveTemplate(t.id)}
                  disabled={savingTemplate}
                  className={cn(
                    "relative rounded-xl border-2 p-3 text-left transition-all hover:shadow-lg group",
                    active ? "border-foreground/50 shadow-md" : "border-border hover:border-muted-foreground/40",
                    locked && "opacity-60"
                  )}
                >
                  {/* Template preview */}
                  <div
                    className="h-28 rounded-lg mb-3 overflow-hidden relative"
                    style={{ background: t.preview.bg }}
                  >
                    {/* Simulated layout based on template */}
                    {t.id === 1 && (
                      // Terminal: dark, grid layout
                      <div style={{ padding: 10, height: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 24, height: 24, borderRadius: 4, background: t.preview.accent + "22", border: `1px solid ${t.preview.accent}44` }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ height: 6, width: 60, background: "#e8e8e8", borderRadius: 2, marginBottom: 3 }} />
                            <div style={{ height: 4, width: 40, background: t.preview.accent + "80", borderRadius: 2 }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, flex: 1 }}>
                          {[1,2,3].map(i => (
                            <div key={i} style={{ flex: 1, background: "#0d0d0d", borderRadius: 4, border: `1px solid ${t.preview.accent}22`, padding: 5 }}>
                              <div style={{ height: 28, background: t.preview.accent + "11", borderRadius: 2, marginBottom: 4 }} />
                              <div style={{ height: 4, width: "80%", background: "#333", borderRadius: 2 }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {t.id === 2 && (
                      // Magazine: white, bold type, colored blocks
                      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <div style={{ padding: "8px 10px", borderBottom: "1px solid #e8e8e8", display: "flex", alignItems: "center", gap: 6, background: "#fff" }}>
                          <div style={{ width: 16, height: 16, borderRadius: "50%", background: t.preview.accent }} />
                          <div style={{ height: 5, width: 50, background: "#111", borderRadius: 2 }} />
                        </div>
                        <div style={{ flex: 1, padding: "8px 10px", background: t.preview.bg }}>
                          <div style={{ height: 16, width: "70%", background: "#111", borderRadius: 2, marginBottom: 4 }} />
                          <div style={{ height: 10, width: "90%", background: "#111", borderRadius: 2, WebkitTextStroke: "1px #111", opacity: 0.15, marginBottom: 8 }} />
                          <div style={{ display: "flex", gap: 4 }}>
                            <div style={{ padding: "3px 8px", background: t.preview.accent, borderRadius: 2, height: 16 }} />
                            <div style={{ padding: "3px 8px", border: "1.5px solid #111", borderRadius: 2, height: 16 }} />
                          </div>
                        </div>
                      </div>
                    )}
                    {t.id === 3 && (
                      // Studio: soft gradient, centered, cards
                      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: `linear-gradient(135deg, #fdfcfb, ${t.preview.accent}15)`, padding: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${t.preview.accent}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.preview.accent }} />
                        </div>
                        <div style={{ height: 7, width: 70, background: "#222", borderRadius: 99, marginBottom: 2 }} />
                        <div style={{ height: 4, width: 50, background: "#888", borderRadius: 99, marginBottom: 6 }} />
                        <div style={{ display: "flex", gap: 4 }}>
                          <div style={{ padding: "3px 10px", background: t.preview.accent, borderRadius: 999, height: 14 }} />
                          <div style={{ padding: "3px 10px", border: "1px solid #ccc", borderRadius: 999, height: 14 }} />
                        </div>
                      </div>
                    )}
                    {locked && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-lg">
                        <Sparkles className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{t.name}</span>
                    {active && <CheckCircle className="h-3.5 w-3.5 text-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                  {locked && (
                    <span className="absolute top-2 right-2 text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-semibold" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "0.06em" }}>PRO</span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Accent colour ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Accent Colour</CardTitle>
          </div>
          <CardDescription>Used for highlights, buttons, and interactive elements across your page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Preset swatches */}
          <div>
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "0.1em" }}>Presets</p>
            <div className="flex flex-wrap gap-3">
              {ACCENT_PRESETS.map(preset => {
                const isActive = accentColor === preset.hex;
                return (
                  <button
                    key={preset.hex}
                    onClick={() => { setAccentColor(preset.hex); setCustomAccent(preset.hex); }}
                    title={preset.name}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: preset.hex,
                      border: isActive ? "3px solid rgba(255,255,255,0.9)" : "3px solid transparent",
                      outline: isActive ? "2px solid rgba(255,255,255,0.4)" : "2px solid transparent",
                      boxShadow: isActive ? `0 0 0 1px ${preset.hex}, 0 4px 12px ${preset.hex}55` : "none",
                      cursor: "pointer",
                      transition: "all 150ms",
                      transform: isActive ? "scale(1.15)" : "scale(1)",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Custom colour picker */}
          <div>
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "0.1em" }}>Custom</p>
            <div className="flex items-center gap-3">
              {/* Gradient wheel-style input */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`,
                  padding: 3,
                  cursor: "pointer",
                }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: accentColor, border: "3px solid rgba(5,5,5,0.8)" }} />
                </div>
                <input
                  type="color"
                  value={customAccent}
                  onChange={e => { setCustomAccent(e.target.value); setAccentColor(e.target.value); }}
                  style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
                />
              </div>

              {/* Hex input */}
              <div className="flex items-center gap-2 flex-1">
                <div style={{ width: 20, height: 20, borderRadius: 4, background: accentColor, border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                <input
                  type="text"
                  value={customAccent.toUpperCase()}
                  onChange={e => {
                    const val = e.target.value;
                    setCustomAccent(val);
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setAccentColor(val);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6, padding: "7px 12px",
                    fontSize: 13, color: "#e8e8e8",
                    fontFamily: "'DM Mono', monospace",
                    width: 100, outline: "none",
                    letterSpacing: "0.06em",
                  }}
                  maxLength={7}
                  placeholder="#e8ff47"
                />
                <span className="text-xs text-muted-foreground">HEX</span>
              </div>

              {/* Live preview strip */}
              <div style={{ flex: 1, height: 32, borderRadius: 6, background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`, border: `1px solid ${accentColor}33`, display: "flex", alignItems: "center", paddingLeft: 12, gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor }} />
                <span style={{ fontSize: 11, color: accentColor, fontFamily: "'DM Mono', monospace" }}>preview</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Font selector ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Typography</CardTitle>
          </div>
          <CardDescription>Choose the typeface for your public page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {FONT_OPTIONS.map(opt => {
              const active = fontId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFontId(opt.id)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 text-left transition-all",
                    active ? "border-foreground/40 bg-foreground/5" : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div style={{ fontFamily: opt.style, fontSize: 20, color: active ? "#fff" : "#e8e8e8", marginBottom: 6, lineHeight: 1.2 }}>
                    {opt.sample}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{opt.name}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                    {active && <CheckCircle className="h-4 w-4 text-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save appearance button */}
      <Button onClick={saveAppearance} disabled={savingAppearance} className="w-full sm:w-auto">
        {savingAppearance && <Loader2 className="h-4 w-4 animate-spin" />}
        Save appearance
      </Button>

      {/* ── Danger zone ── */}
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