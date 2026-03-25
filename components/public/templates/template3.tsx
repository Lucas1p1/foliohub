"use client";
import { Globe, Mail, MapPin, MessageCircle } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export function Template3({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  const { track } = useTrack(profile.id);
  const social = profile.social_links as Record<string, string>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">

        {/* Header */}
        <header className="flex items-start gap-5 mb-10 pb-10 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-base font-semibold text-gray-500 shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" className="w-full h-full object-cover" />
            ) : (
              getInitials(profile.full_name)
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">{profile.full_name ?? profile.username}</h1>
            {profile.headline && <p className="text-gray-500 mt-0.5">{profile.headline}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {profile.location && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />{profile.location}
                </span>
              )}
              {profile.email_contact && (
                <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  <Mail className="h-3 w-3" />{profile.email_contact}
                </a>
              )}
              {social?.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  <FaGithub className="h-3 w-3" />GitHub
                </a>
              )}
              {social?.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  <FaLinkedin className="h-3 w-3" />LinkedIn
                </a>
              )}
              {social?.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  <FaTwitter className="h-3 w-3" />X
                </a>
              )}
              {social?.website && (
                <a href={social.website} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  <Globe className="h-3 w-3" />Website
                </a>
              )}
            </div>
          </div>
          {profile.whatsapp && (
            <a
              href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click")}
              className="shrink-0 flex items-center gap-1.5 bg-black text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Contact
            </a>
          )}
        </header>

        {/* About */}
        {profile.bio && (
          <section className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
          </section>
        )}

        {/* Services */}
        {services.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Services</h2>
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{s.title}</p>
                    {s.description && <p className="text-gray-500 text-sm mt-0.5">{s.description}</p>}
                  </div>
                  {s.price && (
                    <span className="text-xs font-mono text-gray-500 shrink-0">{s.price}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Projects</h2>
            <div className="space-y-6">
              {projects.map((p) => (
                <div key={p.id} className="group">
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getProjectImageUrl(p.image_url) ?? ""} alt={p.title}
                      className="w-full h-48 object-cover rounded-lg mb-3 border border-gray-100" />
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{p.title}</h3>
                      {p.description && (
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">{p.description}</p>
                      )}
                    </div>
                    <div className="flex gap-3 shrink-0">
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                          className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                          <Globe className="h-3 w-3" /> Live
                        </a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                          className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                          <FaGithub className="h-3 w-3" /> Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact section */}
        <section className="mt-12 pt-10 border-t border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Get in touch</h2>
          <p className="text-gray-600 text-sm mb-4">
            Available for freelance work and full-time opportunities.
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.whatsapp && (
              <a
                href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")}
                className="flex items-center gap-1.5 bg-black text-white text-sm px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {profile.email_contact && (
              <a
                href={`mailto:${profile.email_contact}`}
                onClick={() => track("email_click")}
                className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm px-5 py-2.5 rounded-full font-medium hover:border-gray-400 transition-colors"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
          </div>
        </section>

        {/* Footer branding */}
        {profile.plan === "free" && (
          <footer className="mt-16 pt-8 border-t border-gray-50 text-center">
            <a href="/" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
              Made with {APP_NAME}
            </a>
          </footer>
        )}
      </div>
    </div>
  );
}
