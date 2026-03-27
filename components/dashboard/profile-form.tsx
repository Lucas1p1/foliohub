"use client";

import { useState, useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials, getAvatarUrl, isValidUsername } from "@/lib/utils";
import type { Profile } from "@/types";

export function ProfileForm({ profile, userId }: { profile: Profile; userId: string }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    username: profile.username ?? "",
    full_name: profile.full_name ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    whatsapp: profile.whatsapp ?? "",
    email_contact: profile.email_contact ?? "",
    twitter: (profile.social_links as Record<string,string>)?.twitter ?? "",
    linkedin: (profile.social_links as Record<string,string>)?.linkedin ?? "",
    github: (profile.social_links as Record<string,string>)?.github ?? "",
    website: (profile.social_links as Record<string,string>)?.website ?? "",
  });

  async function uploadAvatar(file: File) {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const url = `${userId}/avatar.${ext}`;
      await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);
      setAvatarUrl(url);
      toast({ title: "Photo updated" });
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
        github: form.github || null,
        website: form.website || null,
      },
    }).eq("id", userId);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved ✓" });
    }
    setSaving(false);
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader><CardTitle className="text-base">Photo</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex items-center justify-center text-lg font-semibold shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getAvatarUrl(avatarUrl) ?? ""} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(form.full_name || form.username)
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
            />
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
        <CardHeader><CardTitle className="text-base">Basic info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username (your URL)</Label>
              <div className="flex rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring">
                <span className="px-3 flex items-center bg-muted text-muted-foreground text-sm border-r border-input">Introhub.co/</span>
                <input
                  id="username"
                  value={form.username}
                  onChange={set("username")}
                  className="flex-1 px-3 py-2 text-sm bg-background focus:outline-none"
                  placeholder="yourname"
                />
              </div>
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
        <CardHeader><CardTitle className="text-base">Contact info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
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
        <CardHeader><CardTitle className="text-base">Social links</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          {[
            { field: "github", label: "GitHub", placeholder: "https://github.com/username" },
            { field: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
            { field: "twitter", label: "X / Twitter", placeholder: "https://x.com/username" },
            { field: "website", label: "Website", placeholder: "https://yoursite.com" },
          ].map((s) => (
            <div key={s.field} className="space-y-1.5">
              <Label htmlFor={s.field}>{s.label}</Label>
              <Input id={s.field} value={(form as Record<string,string>)[s.field]} onChange={set(s.field)} placeholder={s.placeholder} type="url" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}
