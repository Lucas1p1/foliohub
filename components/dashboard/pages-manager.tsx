"use client";

import { useState } from "react";
import { Plus, Globe, Pencil, Trash2, Loader2, ExternalLink, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { cn, isValidUsername } from "@/lib/utils";
import type { Page, Project, Service } from "@/types";
import { ProjectsManager } from "@/components/dashboard/projects-manager";
import { ServicesManager } from "@/components/dashboard/services-manager";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

const TEMPLATES = [
  { id: 1, name: "Developer", preview: "bg-gradient-to-br from-slate-900 to-slate-800", free: true },
  { id: 2, name: "Freelancer", preview: "bg-gradient-to-br from-orange-50 to-amber-50", free: false },
  { id: 3, name: "Minimal CV", preview: "bg-gradient-to-br from-gray-50 to-gray-100", free: false },
];

interface PagesManagerProps {
  pages: (Page & { projects: Project[]; services: Service[] })[];
  userId: string;
  userPlan: "free" | "pro";
  publishedCount: number;
}

const MAX_PAGES = 5;
const MAX_PUBLISHED = 2;

export function PagesManager({ pages: initial, userId, userPlan, publishedCount: initialPublishedCount }: PagesManagerProps) {
  const { toast } = useToast();
  const [pages, setPages] = useState(initial);
  const [activeTab, setActiveTab] = useState<string | "new">(initial[0]?.id ?? "new");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const publishedCount = pages.filter((p) => p.is_published).length;

  // ── New page form state ──────────────────────────────────
  const [newForm, setNewForm] = useState({ label: "", username: "" });

  // ── Per-page edit state ──────────────────────────────────
  const [editForms, setEditForms] = useState<Record<string, Partial<Page>>>(
    Object.fromEntries(initial.map((p) => [p.id, {
      label: p.label,
      username: p.username,
      headline: p.headline ?? "",
      bio: p.bio ?? "",
      location: p.location ?? "",
      whatsapp: p.whatsapp ?? "",
      email_contact: p.email_contact ?? "",
      template_id: p.template_id,
      social_links: p.social_links,
    }]))
  );

  function setField(pageId: string, field: string, value: string | number) {
    setEditForms((prev) => ({ ...prev, [pageId]: { ...prev[pageId], [field]: value } }));
  }

  // ── Create new page ──────────────────────────────────────
  async function createPage() {
    if (!newForm.label.trim() || !newForm.username.trim()) return;
    if (!isValidUsername(newForm.username)) {
      toast({ title: "Invalid URL", description: "3–30 chars, lowercase letters/numbers/underscores/hyphens only", variant: "destructive" });
      return;
    }
    setCreating(true);
    const { data, error } = await supabase
      .from("pages")
      .insert({ profile_id: userId, label: newForm.label, username: newForm.username })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message.includes("unique") ? "That URL is already taken" : error.message, variant: "destructive" });
    } else {
      const newPage = { ...data, projects: [], services: [] };
      setPages((p) => [...p, newPage]);
      setEditForms((prev) => ({ ...prev, [data.id]: { label: data.label, username: data.username, headline: "", bio: "", location: "", whatsapp: "", email_contact: "", template_id: 1, social_links: {} } }));
      setActiveTab(data.id);
      setNewForm({ label: "", username: "" });
      toast({ title: "Page created ✓" });
    }
    setCreating(false);
  }

  // ── Save page info ───────────────────────────────────────
  async function savePage(pageId: string) {
    const form = editForms[pageId];
    if (!form?.username || !isValidUsername(form.username as string)) {
      toast({ title: "Invalid URL", description: "3–30 chars, lowercase letters/numbers/underscores/hyphens only", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("pages").update({
      label: form.label,
      username: form.username,
      headline: form.headline || null,
      bio: form.bio || null,
      location: form.location || null,
      whatsapp: form.whatsapp || null,
      email_contact: form.email_contact || null,
      template_id: form.template_id,
      social_links: form.social_links,
    }).eq("id", pageId);

    if (error) {
      toast({ title: "Error", description: error.message.includes("unique") ? "That URL is already taken" : error.message, variant: "destructive" });
    } else {
      setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, ...form } as typeof p : p));
      toast({ title: "Page saved ✓" });
    }
    setSaving(false);
  }

  // ── Toggle publish ───────────────────────────────────────
  async function togglePublish(pageId: string, val: boolean) {
    if (val && publishedCount >= MAX_PUBLISHED) {
      toast({ title: "Limit reached", description: `You can only have ${MAX_PUBLISHED} pages live at a time. Unpublish another first.`, variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("pages").update({ is_published: val }).eq("id", pageId);
    if (!error) {
      setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, is_published: val } : p));
      toast({ title: val ? "Page is live! 🎉" : "Page set to draft" });
    }
  }

  // ── Delete page ──────────────────────────────────────────
  async function deletePage(pageId: string) {
    if (!confirm("Delete this page? All its projects and services will be deleted too.")) return;
    setDeleting(pageId);
    const { error } = await supabase.from("pages").delete().eq("id", pageId);
    if (!error) {
      const remaining = pages.filter((p) => p.id !== pageId);
      setPages(remaining);
      setActiveTab(remaining[0]?.id ?? "new");
      toast({ title: "Page deleted" });
    }
    setDeleting(null);
  }

  const activePage = pages.find((p) => p.id === activeTab);

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
              activeTab === p.id
                ? "bg-background border border-b-background border-border -mb-px text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
            {p.is_published && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
          </button>
        ))}
        {pages.length < MAX_PAGES && (
          <button
            onClick={() => setActiveTab("new")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm whitespace-nowrap transition-colors shrink-0",
              activeTab === "new"
                ? "bg-background border border-b-background border-border -mb-px text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Plus className="h-3.5 w-3.5" /> New page
          </button>
        )}
        <div className="ml-auto shrink-0 text-xs text-muted-foreground px-2">
          {pages.length}/{MAX_PAGES} pages · {publishedCount}/{MAX_PUBLISHED} live
        </div>
      </div>

      {/* New page form */}
      {activeTab === "new" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create a new page</CardTitle>
            <CardDescription>Each page gets its own URL and content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Page name</Label>
                <Input
                  value={newForm.label}
                  onChange={(e) => setNewForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. Design Portfolio"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Page URL</Label>
                <div className="flex rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring">
                  <span className="px-3 flex items-center bg-muted text-muted-foreground text-sm border-r border-input whitespace-nowrap">Introhub.co/</span>
                  <input
                    value={newForm.username}
                    onChange={(e) => setNewForm((p) => ({ ...p, username: e.target.value.toLowerCase() }))}
                    className="flex-1 px-3 py-2 text-sm bg-background focus:outline-none"
                    placeholder="yourname-design"
                  />
                </div>
              </div>
            </div>
            <Button onClick={createPage} disabled={creating || !newForm.label.trim() || !newForm.username.trim()}>
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create page
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Page editor */}
      {activePage && (
        <div className="space-y-6">
          {/* Header row */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-3 min-w-0">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{activePage.label}</p>
                  <Badge variant={activePage.is_published ? "default" : "secondary"} className="text-xs">
                    {activePage.is_published ? "Live" : "Draft"}
                  </Badge>
                </div>
                <a
                  href={`${APP_URL}/${editForms[activePage.id]?.username ?? activePage.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-0.5"
                >
                  <ExternalLink className="h-3 w-3" />
                  {APP_URL}/{editForms[activePage.id]?.username ?? activePage.username}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-muted-foreground">{activePage.is_published ? "Live" : "Draft"}</span>
              <Switch
                checked={activePage.is_published}
                onCheckedChange={(val) => togglePublish(activePage.id, val)}
                disabled={!activePage.is_published && publishedCount >= MAX_PUBLISHED}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deletePage(activePage.id)}
                disabled={deleting === activePage.id}
                className="text-destructive hover:bg-destructive/10"
              >
                {deleting === activePage.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Info form */}
          <Card>
            <CardHeader><CardTitle className="text-base">Page info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Page name (tab label)</Label>
                  <Input
                    value={(editForms[activePage.id]?.label as string) ?? ""}
                    onChange={(e) => setField(activePage.id, "label", e.target.value)}
                    placeholder="e.g. Design Portfolio"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Page URL</Label>
                  <div className="flex rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring">
                    <span className="px-3 flex items-center bg-muted text-muted-foreground text-sm border-r border-input whitespace-nowrap">Introhub.co/</span>
                    <input
                      value={(editForms[activePage.id]?.username as string) ?? ""}
                      onChange={(e) => setField(activePage.id, "username", e.target.value.toLowerCase())}
                      className="flex-1 px-3 py-2 text-sm bg-background focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Headline</Label>
                <Input
                  value={(editForms[activePage.id]?.headline as string) ?? ""}
                  onChange={(e) => setField(activePage.id, "headline", e.target.value)}
                  placeholder="Frontend Developer · Open to work"
                  maxLength={100}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Textarea
                  value={(editForms[activePage.id]?.bio as string) ?? ""}
                  onChange={(e) => setField(activePage.id, "bio", e.target.value)}
                  placeholder="What this page is about..."
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input
                    value={(editForms[activePage.id]?.location as string) ?? ""}
                    onChange={(e) => setField(activePage.id, "location", e.target.value)}
                    placeholder="Lagos, Nigeria"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>WhatsApp</Label>
                  <Input
                    value={(editForms[activePage.id]?.whatsapp as string) ?? ""}
                    onChange={(e) => setField(activePage.id, "whatsapp", e.target.value)}
                    placeholder="+2348012345678"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Contact email</Label>
                <Input
                  value={(editForms[activePage.id]?.email_contact as string) ?? ""}
                  onChange={(e) => setField(activePage.id, "email_contact", e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
            </CardContent>
          </Card>

          {/* Template picker */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Template</CardTitle>
              <CardDescription>Choose a layout for this page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((t) => {
                  const locked = !t.free && userPlan === "free";
                  const active = (editForms[activePage.id]?.template_id ?? activePage.template_id) === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (locked) {
                          toast({ title: "Pro required", description: "Upgrade to use this template.", variant: "destructive" });
                          return;
                        }
                        setField(activePage.id, "template_id", t.id);
                      }}
                      className={cn(
                        "relative rounded-xl border-2 p-2 text-left transition-all",
                        active ? "border-foreground" : "border-border hover:border-muted-foreground",
                        locked && "opacity-60"
                      )}
                    >
                      <div className={cn("h-14 rounded-lg mb-2", t.preview)} />
                      <p className="text-xs font-medium">{t.name}</p>
                      {locked && <span className="absolute top-1.5 right-1.5 text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-semibold">Pro</span>}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => savePage(activePage.id)} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save page
          </Button>

          {/* Projects */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Projects shown on this specific page</p>
            </div>
            <ProjectsManager
              projects={activePage.projects}
              userId={userId}
              pageId={activePage.id}
            />
          </div>

          {/* Services */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Services</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Services shown on this specific page</p>
            </div>
            <ServicesManager
              services={activePage.services}
              userId={userId}
              pageId={activePage.id}
            />
          </div>
        </div>
      )}

      {pages.length === 0 && activeTab !== "new" && (
        <div className="text-center py-12 text-muted-foreground">
          <Globe className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No pages yet. Create your first one above.</p>
        </div>
      )}
    </div>
  );
}