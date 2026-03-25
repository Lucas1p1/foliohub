"use client";

import { useEffect } from "react";
import { Globe, Mail, MapPin, MessageCircle } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export function Template1({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  const { track } = useTrack(profile.id);
  const social = profile.social_links as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="text-sm text-white/40 font-mono">{profile.username}.foliohub.co</span>
        {profile.whatsapp && (
          <a
            href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click")}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Hire me
          </a>
        )}
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center text-2xl font-bold shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt={profile.full_name ?? ""} className="w-full h-full object-cover" />
            ) : (
              getInitials(profile.full_name)
            )}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {profile.full_name ?? profile.username}
            </h1>
            {profile.headline && (
              <p className="text-white/60 text-lg mt-1">{profile.headline}</p>
            )}
            {profile.location && (
              <div className="flex items-center gap-1.5 text-white/40 text-sm mt-2">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">{profile.bio}</p>
        )}

        {/* Social + contact row */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {profile.whatsapp && (
            <a
              href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click")}
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 px-4 py-2 rounded-full text-sm transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
          {profile.email_contact && (
            <a
              href={`mailto:${profile.email_contact}`}
              onClick={() => track("email_click")}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 px-4 py-2 rounded-full text-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
          {social?.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 p-2 rounded-full transition-colors">
              <FaGithub className="h-4 w-4" />
            </a>
          )}
          {social?.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 p-2 rounded-full transition-colors">
              <FaLinkedin className="h-4 w-4" />
            </a>
          )}
          {social?.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 p-2 rounded-full transition-colors">
              <FaTwitter className="h-4 w-4" />
            </a>
          )}
          {social?.website && (
            <a href={social.website} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 p-2 rounded-full transition-colors">
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12 border-t border-white/5">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-mono mb-6">What I offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.06] transition-colors">
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                {s.description && <p className="text-sm text-white/50 leading-relaxed mb-3">{s.description}</p>}
                {s.price && (
                  <span className="text-sm font-mono text-green-400">{s.price}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12 border-t border-white/5">
          <h2 className="text-xs uppercase tracking-widest text-white/30 font-mono mb-6">Projects</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="group bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/20 transition-all">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getProjectImageUrl(p.image_url) ?? ""}
                    alt={p.title}
                    className="w-full h-44 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="font-semibold mb-1.5">{p.title}</h3>
                  {p.description && (
                    <p className="text-sm text-white/50 leading-relaxed mb-3 line-clamp-3">{p.description}</p>
                  )}
                  <div className="flex gap-3">
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
                        <Globe className="h-3 w-3" /> Live demo
                      </a>
                    )}
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
                        <FaGithub className="h-3 w-3" /> Source code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-10 border-t border-white/5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        {profile.plan === "free" && (
          <a href="/" className="text-xs text-white/20 hover:text-white/40 transition-colors">
            Made with {APP_NAME}
          </a>
        )}
        <div className="flex items-center gap-4 ml-auto">
          {profile.whatsapp && (
            <a
              href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click")}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Get in touch
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
