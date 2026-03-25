import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Template1 } from "@/components/public/templates/template1";
import { Template2 } from "@/components/public/templates/template2";
import { Template3 } from "@/components/public/templates/template3";
import type { PublicProfileData } from "@/types";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, headline, avatar_url")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  if (!profile) return { title: "Profile not found" };

  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";
  return {
    title: `${profile.full_name ?? username} — ${profile.headline ?? ""}`,
    description: `View ${profile.full_name ?? username}'s professional profile on ${APP_NAME}`,
    openGraph: {
      title: profile.full_name ?? username,
      description: profile.headline ?? undefined,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  if (!profile) notFound();

  const [{ data: projects }, { data: services }] = await Promise.all([
    supabase.from("projects").select("*").eq("profile_id", profile.id).order("order_index"),
    supabase.from("services").select("*").eq("profile_id", profile.id).order("order_index"),
  ]);

  const data: PublicProfileData = {
    profile,
    projects: projects ?? [],
    services: services ?? [],
  };

  const templates = {
    1: Template1,
    2: Template2,
    3: Template3,
  };
  const TemplateComponent = templates[profile.template_id as 1 | 2 | 3] ?? Template1;

  return <TemplateComponent data={data} />;
}
