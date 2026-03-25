"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { Service } from "@/types";

const EMPTY = { title: "", description: "", price: "" };

export function ServicesManager({ services: initial, userId }: { services: Service[]; userId: string }) {
  const { toast } = useToast();
  const [services, setServices] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const supabase = createClient();

  async function add() {
    if (!form.title.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("services").insert({
      profile_id: userId,
      title: form.title,
      description: form.description || null,
      price: form.price || null,
      order_index: services.length,
    }).select().single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setServices((s) => [...s, data]);
      setForm(EMPTY);
      setShowAdd(false);
      toast({ title: "Service added ✓" });
    }
    setSaving(false);
  }

  async function remove(id: string) {
    await supabase.from("services").delete().eq("id", id);
    setServices((s) => s.filter((x) => x.id !== id));
    toast({ title: "Service removed" });
  }

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div className="space-y-3">
      {services.map((s) => (
        <Card key={s.id}>
          <CardContent className="p-4 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{s.title}</p>
                {s.price && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s.price}</span>
                )}
              </div>
              {s.description && <p className="text-xs text-muted-foreground mt-1">{s.description}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(s.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </CardContent>
        </Card>
      ))}

      {showAdd ? (
        <Card className="ring-2 ring-ring">
          <CardContent className="p-4 space-y-4">
            <p className="font-medium text-sm">New service</p>
            <div className="space-y-1.5">
              <Label>Service name *</Label>
              <Input value={form.title} onChange={set("title")} placeholder="e.g. Frontend Development" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={set("description")} placeholder="What's included..." rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Price (optional)</Label>
              <Input value={form.price} onChange={set("price")} placeholder="e.g. From $500 or $50/hr" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={add} disabled={saving || !form.title.trim()}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Add service
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setForm(EMPTY); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" className="w-full border-dashed h-12" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" /> Add service
        </Button>
      )}
    </div>
  );
}
