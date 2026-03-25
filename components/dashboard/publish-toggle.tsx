"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/use-toast";

export function PublishToggle({ profileId, isPublished }: { profileId: string; isPublished: boolean }) {
  const [published, setPublished] = useState(isPublished);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function toggle(val: boolean) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ is_published: val })
      .eq("id", profileId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPublished(val);
      toast({ title: val ? "Page is live! 🎉" : "Page set to draft" });
    }
    setLoading(false);
  }

  return (
    <Switch
      checked={published}
      onCheckedChange={toggle}
      disabled={loading}
    />
  );
}
