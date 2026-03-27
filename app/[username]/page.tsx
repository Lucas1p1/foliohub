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
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, headline, avatar_url")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  if (profile) {
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

  const { data: page } = await supabase
    .from("pages")
    .select("headline, profiles(full_name, avatar_url)")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  if (page) {
    const ownerName = (page.profiles as unknown as { full_name: string | null } | null)?.full_name ?? username;
    return {
      title: `${ownerName} — ${page.headline ?? ""}`,
      description: `View ${ownerName}'s professional profile on ${APP_NAME}`,
    };
  }

  return { title: "Profile not found" };
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

  if (profile) {
    const [{ data: projects }, { data: services }] = await Promise.all([
      supabase.from("projects").select("*").eq("profile_id", profile.id).is("page_id", null).order("order_index"),
      supabase.from("services").select("*").eq("profile_id", profile.id).is("page_id", null).order("order_index"),
    ]);

    const data: PublicProfileData = {
      profile,
      page: null,
      projects: projects ?? [],
      services: services ?? [],
    };

    console.log("template_id from DB:", profile.template_id);

    const TemplateComponent = getTemplate(profile.template_id);
    return <TemplateComponent data={data} />;
  }

  const { data: page } = await supabase
    .from("pages")
    .select("*, profiles(id, full_name, avatar_url, plan)")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  if (page) {
    const ownerProfile = page.profiles as { id: string; full_name: string | null; avatar_url: string | null; plan: string } | null;

    const [{ data: projects }, { data: services }] = await Promise.all([
      supabase.from("projects").select("*").eq("page_id", page.id).order("order_index"),
      supabase.from("services").select("*").eq("page_id", page.id).order("order_index"),
    ]);

    const data: PublicProfileData = {
      profile: ownerProfile
        ? {
            id: ownerProfile.id,
            username: page.username,
            full_name: ownerProfile.full_name,
            headline: page.headline,
            bio: page.bio,
            avatar_url: ownerProfile.avatar_url,
            location: page.location,
            whatsapp: page.whatsapp,
            email_contact: page.email_contact,
            social_links: page.social_links,
            template_id: page.template_id,
            is_published: page.is_published,
            plan: ownerProfile.plan as "free" | "pro",
            paystack_subscription_code: null,
            paystack_email_token: null,
            created_at: page.created_at,
            updated_at: page.updated_at,
          }
        : null,
      page,
      projects: projects ?? [],
      services: services ?? [],
    };

    console.log("page template_id from DB:", page.template_id);

    const TemplateComponent = getTemplate(page.template_id);
    return <TemplateComponent data={data} />;
  }

  notFound();
}

function getTemplate(templateId: number) {
  const templates: Record<number, React.ComponentType<{ data: PublicProfileData }>> = {
    1: Template1,
    2: Template2,
    3: Template3,
  };
  return templates[templateId] ?? Template1;
}