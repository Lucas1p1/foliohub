"use client";

import { useState, useRef } from "react";
import { GripVertical, Loader2, Plus, Trash2, Upload, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectImageUrl } from "@/lib/utils";
import type { Project } from "@/types";

const EMPTY: Omit<Project, "id" | "profile_id" | "page_id" | "created_at" | "updated_at"> = {
  title: "", description: "", image_url: null, live_url: "", github_url: "", order_index: 0,
};

interface Props {
  projects: Project[];
  userId: string;
  pageId?: string; // if set, projects belong to this page
}

export function ProjectsManager({ projects: initial, userId, pageId }: Props) {
  const { toast } = useToast();
  const [projects, setProjects] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const maxProjects = pageId ? 12 : 12;

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); return null; }
    return path;
  }

  async function addProject() {
    if (!form.title.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("projects").insert({
      profile_id: userId,
      page_id: pageId ?? null,
      title: form.title,
      description: form.description || null,
      image_url: form.image_url,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      order_index: projects.length,
    }).select().single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProjects((p) => [...p, data]);
      setForm(EMPTY);
      setShowAdd(false);
      toast({ title: "Project added ✓" });
    }
    setSaving(false);
  }

  async function updateProject(id: string) {
    setSaving(true);
    const { error } = await supabase.from("projects").update({
      title: form.title,
      description: form.description || null,
      image_url: form.image_url,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
    }).eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProjects((p) => p.map((proj) => proj.id === id ? { ...proj, ...form, id, profile_id: userId, page_id: pageId ?? null, created_at: proj.created_at, updated_at: new Date().toISOString() } : proj));
      setEditing(null);
      toast({ title: "Project updated ✓" });
    }
    setSaving(false);
  }

  async function deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      setProjects((p) => p.filter((proj) => proj.id !== id));
      toast({ title: "Project deleted" });
    }
  }

  function startEdit(p: Project) {
    setEditing(p.id);
    setShowAdd(false);
    setForm({ title: p.title, description: p.description ?? "", image_url: p.image_url, live_url: p.live_url ?? "", github_url: p.github_url ?? "", order_index: p.order_index });
  }

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const ProjectFormFields = ({ onSubmit, onCancel, submitLabel }: { onSubmit: () => void; onCancel: () => void; submitLabel: string }) => (
    <div className="space-y-4 mt-4 pt-4 border-t border-border">
      <div className="space-y-1.5">
        <Label>Project title *</Label>
        <Input value={form.title} onChange={set("title")} placeholder="My awesome project" required />
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea value={form.description ?? ""} onChange={set("description")} placeholder="What you built and what tech you used..." rows={3} />
      </div>
      <div className="space-y-1.5">
        <Label>Project image</Label>
        <div className="flex items-center gap-3">
          {form.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getProjectImageUrl(form.image_url) ?? ""} alt="" className="w-16 h-12 rounded-lg object-cover border" />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const path = await uploadImage(file);
                if (path) setForm((p) => ({ ...p, image_url: path }));
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {form.image_url ? "Change" : "Upload image"}
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Live URL</Label>
          <Input value={form.live_url ?? ""} onChange={set("live_url")} placeholder="https://myproject.com" type="url" />
        </div>
        <div className="space-y-1.5">
          <Label>GitHub URL</Label>
          <Input value={form.github_url ?? ""} onChange={set("github_url")} placeholder="https://github.com/..." type="url" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={onSubmit} disabled={saving || !form.title.trim()}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {projects.map((p) => (
        <Card key={p.id} className={editing === p.id ? "ring-2 ring-ring" : ""}>
          <CardContent className="p-4">
            {editing === p.id ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{p.title}</p>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>×</Button>
                </div>
                <ProjectFormFields
                  onSubmit={() => updateProject(p.id)}
                  onCancel={() => setEditing(null)}
                  submitLabel="Save changes"
                />
              </>
            ) : (
              <div className="flex items-start gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 cursor-grab" />
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getProjectImageUrl(p.image_url) ?? ""} alt="" className="w-12 h-10 rounded-lg object-cover border shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.title}</p>
                  {p.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>}
                  <div className="flex gap-3 mt-1">
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><ExternalLink className="h-3 w-3" />Live</a>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><ExternalLink className="h-3 w-3" />GitHub</a>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteProject(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {showAdd ? (
        <Card className="ring-2 ring-ring">
          <CardContent className="p-4">
            <p className="font-medium text-sm">New project</p>
            <ProjectFormFields
              onSubmit={addProject}
              onCancel={() => { setShowAdd(false); setForm(EMPTY); }}
              submitLabel="Add project"
            />
          </CardContent>
        </Card>
      ) : (
        projects.length < maxProjects && (
          <Button
            variant="outline"
            className="w-full border-dashed h-12"
            onClick={() => { setShowAdd(true); setEditing(null); setForm(EMPTY); }}
          >
            <Plus className="h-4 w-4" /> Add project
          </Button>
        )
      )}
    </div>
  );
}