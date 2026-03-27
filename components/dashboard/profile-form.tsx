"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials, getAvatarUrl, isValidUsername } from "@/lib/utils";
import type { Profile } from "@/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

interface ExtraLink { label: string; url: string; }

function parseExtraLinks(links: Record<string, string>): ExtraLink[] {
  const extras: ExtraLink[] = [];
  let i = 0;
  while (links[`extra_${i}_label`] !== undefined || links[`extra_${i}_url`] !== undefined) {
    extras.push({ label: links[`extra_${i}_label`] ?? "", url: links[`extra_${i}_url`] ?? "" });
    i++;
  }
  return extras;
}

export function ProfileForm({ profile, userId }: { profile: Profile; userId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const fileRef = useRef<HTMLInputElement>(null);

  const socialLinks = (profile.social_links ?? {}) as Record<string, string>;

  const [form, setForm] = useState({
    username: profile.username ?? "",
    full_name: profile.full_name ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    whatsapp: profile.whatsapp ?? "",
    email_contact: profile.email_contact ?? "",
    twitter: socialLinks.twitter ?? "",
    linkedin: socialLinks.linkedin ?? "",
    instagram: socialLinks.instagram ?? "",
    tiktok: socialLinks.tiktok ?? "",
  });

  const [extraLinks, setExtraLinks] = useState<ExtraLink[]>(parseExtraLinks(socialLinks));

  function addExtraLink() {
    if (extraLinks.length >= 5) return;
    setExtraLinks(p => [...p, { label: "", url: "" }]);
  }
  function removeExtraLink(i: number) {
    setExtraLinks(p => p.filter((_, idx) => idx !== i));
  }
  function updateExtraLink(i: number, field: "label" | "url", value: string) {
    setExtraLinks(p => p.map((link, idx) => idx === i ? { ...link, [field]: value } : link));
  }

  async function uploadAvatar(file: File) {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      await supabase.from("profiles").update({ avatar_url: `${userId}/avatar.${ext}` }).eq("id", userId);
      setAvatarUrl(`${userId}/avatar.${ext}`);
      toast({ title: "Photo updated" });
      router.refresh();
    }
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUsername(form.username)) {
      toast({ title: "Invalid username", description: "3–30 chars, letters/numbers/underscores/hyphens only", variant: "destructive" });
      return;
    }
    setSaving(true);
    const supabase = createClient();

    const extraSerialized: Record<string, string> = {};
    extraLinks.forEach((link, i) => {
      if (link.label || link.url) {
        extraSerialized[`extra_${i}_label`] = link.label;
        extraSerialized[`extra_${i}_url`] = link.url;
      }
    });

    const { error } = await supabase.from("profiles").update({
      username: form.username,
      full_name: form.full_name || null,
      headline: form.headline || null,
      bio: form.bio || null,
      location: form.location || null,
      whatsapp: form.whatsapp || null,
      email_contact: form.email_contact || null,
      social_links: {
        twitter: form.twitter || null,
        linkedin: form.linkedin || null,
        instagram: form.instagram || null,
        tiktok: form.tiktok || null,
        ...extraSerialized,
      },
    }).eq("id", userId);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved ✓" });
      router.refresh();
    }
    setSaving(false);
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <form onSubmit={save} className="space-y-4 sm:space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6"><CardTitle className="text-base">Photo</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted overflow-hidden flex items-center justify-center text-base sm:text-lg font-semibold shrink-0">
            {avatarUrl
              ? <img src={getAvatarUrl(avatarUrl) ?? ""} alt="Avatar" className="w-full h-full object-cover" /> // eslint-disable-line
              : getInitials(form.full_name || form.username)
            }
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload photo
            </Button>
            <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG or WebP · Max 2MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Basic info */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6"><CardTitle className="text-base">Basic info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Username + name - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username (your URL)</Label>
              <div className="flex rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring">
                <span className="px-2 sm:px-3 flex items-center bg-muted text-muted-foreground text-xs sm:text-sm border-r border-input shrink-0 truncate max-w-[110px]">
                  {APP_URL}/
                </span>
                <input id="username" value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value.toLowerCase() }))}
                  className="flex-1 px-3 py-2 text-sm bg-background focus:outline-none min-w-0"
                  placeholder="yourname" />
              </div>
              <a href={`${APP_URL}/${form.username}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-full">
                <ExternalLink className="h-3 w-3 shrink-0" />
                <span className="truncate">{APP_URL}/{form.username}</span>
              </a>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" value={form.full_name} onChange={set("full_name")} placeholder="Jane Smith" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={form.headline} onChange={set("headline")} placeholder="Frontend Developer · Open to work" maxLength={100} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={form.bio} onChange={set("bio")} placeholder="A short description about yourself..." rows={4} maxLength={500} />
            <p className="text-xs text-muted-foreground text-right">{form.bio.length}/500</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={form.location} onChange={set("location")} placeholder="Lagos, Nigeria" />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6"><CardTitle className="text-base">Contact info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp number</Label>
              <Input id="whatsapp" value={form.whatsapp} onChange={set("whatsapp")} placeholder="+2348012345678" type="tel" />
              <p className="text-xs text-muted-foreground">Include country code e.g. +234</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email_contact">Contact email</Label>
              <Input id="email_contact" value={form.email_contact} onChange={set("email_contact")} placeholder="you@example.com" type="email" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social links */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6"><CardTitle className="text-base">Social links</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { field: "linkedin",  label: "LinkedIn",    placeholder: "https://linkedin.com/in/username" },
              { field: "twitter",   label: "X / Twitter", placeholder: "https://x.com/username" },
              { field: "instagram", label: "Instagram",   placeholder: "https://instagram.com/username" },
              { field: "tiktok",    label: "TikTok",      placeholder: "https://tiktok.com/@username" },
            ].map(s => (
              <div key={s.field} className="space-y-1.5">
                <Label htmlFor={s.field}>{s.label}</Label>
                <Input id={s.field} value={(form as Record<string, string>)[s.field]}
                  onChange={set(s.field)} placeholder={s.placeholder} type="url" />
              </div>
            ))}
          </div>

          {/* Extra links */}
          {extraLinks.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <p className="text-xs text-muted-foreground font-medium" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Extra links
              </p>
              {extraLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  {/* On mobile, stack label + url vertically */}
                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <Input value={link.label} onChange={e => updateExtraLink(i, "label", e.target.value)}
                      placeholder="Label" className="sm:w-32 sm:shrink-0" />
                    <Input value={link.url} onChange={e => updateExtraLink(i, "url", e.target.value)}
                      placeholder="https://..." type="url" />
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeExtraLink(i)}
                    className="shrink-0 text-muted-foreground hover:text-destructive px-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button type="button" variant="outline" size="sm" onClick={addExtraLink}
            className="border-dashed" disabled={extraLinks.length >= 5}>
            <Plus className="h-3.5 w-3.5" /> Add another link
          </Button>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}