export type Plan = "free" | "pro";

export type EventType =
  | "page_view"
  | "whatsapp_click"
  | "email_click"
  | "github_click"
  | "live_url_click";

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  whatsapp: string | null;
  email_contact: string | null;
  social_links: SocialLinks;
  template_id: 1 | 2 | 3;
  is_published: boolean;
  plan: Plan;
  paystack_subscription_code: string | null;
  paystack_email_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  profile_id: string;
  username: string;
  label: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  whatsapp: string | null;
  email_contact: string | null;
  social_links: SocialLinks;
  template_id: 1 | 2 | 3;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  profile_id: string;
  page_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  profile_id: string;
  page_id: string | null;
  title: string;
  description: string | null;
  price: string | null;
  order_index: number;
  created_at: string;
}

export interface PageEvent {
  id: string;
  profile_id: string;
  page_id: string | null;
  event_type: EventType;
  visitor_id: string | null;
  referrer: string | null;
  created_at: string;
}

export interface PublicProfileData {
  profile: Profile | null;
  page: Page | null;
  projects: Project[];
  services: Service[];
}

export interface AnalyticsSummary {
  total_views: number;
  whatsapp_clicks: number;
  email_clicks: number;
  views_this_week: number;
  views_last_week: number;
}