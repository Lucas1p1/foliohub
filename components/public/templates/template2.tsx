"use client";

import { MapPin, ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export function Template2({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  if (!profile) return null;
  const { track } = useTrack(profile.id);
  const social = profile.social_links as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#f5f0e8]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Magazine-style header bar */}
      <div className="bg-[#1a1a1a] text-[#f5f0e8] py-2 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-[10px] tracking-[0.4em] uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
            {profile.location && (
              <span className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {profile.location}
              </span>
            )}
          </div>
          <div className="text-[10px] tracking-[0.4em] uppercase font-sans text-white/40" style={{ fontFamily: "system-ui, sans-serif" }}>
            {profile.username} · Portfolio
          </div>
          <div className="flex items-center gap-4">
            {social?.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                className="text-white/40 hover:text-white transition-colors">
                <FaGithub className="h-3.5 w-3.5" />
              </a>
            )}
            {social?.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors">
                <FaLinkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {social?.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors">
                <FaTwitter className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hero — magazine cover layout */}
      <section className="max-w-6xl mx-auto px-8">
        {/* Big editorial title */}
        <div className="border-b-2 border-[#1a1a1a] pt-16 pb-10">
          <h1 className="text-[clamp(4rem,12vw,9rem)] font-normal leading-[0.9] tracking-tighter text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}>
            {profile.full_name ?? profile.username}
          </h1>
        </div>

        {/* Subheader row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-b border-[#1a1a1a]/20">
          <div className="lg:col-span-2 py-8 pr-8 border-r border-[#1a1a1a]/20">
            {profile.headline && (
              <p className="text-2xl text-[#1a1a1a]/70 italic leading-snug" style={{ fontFamily: "'Georgia', serif" }}>
                {profile.headline}
              </p>
            )}
            {profile.bio && (
              <p className="text-sm text-[#1a1a1a]/50 mt-4 leading-relaxed max-w-xl font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                {profile.bio}
              </p>
            )}
          </div>
          <div className="py-8 pl-8 flex flex-col justify-between">
            {/* Avatar */}
            <div className="w-24 h-24 overflow-hidden mb-6">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getAvatarUrl(profile.avatar_url) ?? ""}
                  alt={profile.full_name ?? ""}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-2xl text-[#f5f0e8]"
                  style={{ fontFamily: "'Georgia', serif" }}>
                  {getInitials(profile.full_name)}
                </div>
              )}
            </div>
            {profile.whatsapp && (
              <a
                href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")}
                className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-[#f5f0e8] px-6 py-3 hover:bg-[#333] transition-colors duration-300 w-fit"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs tracking-[0.2em] uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Get in touch
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Services — editorial grid */}
      {services.length > 0 && (
        <section className="max-w-6xl mx-auto px-8 py-16">
          <div className="flex items-baseline gap-6 mb-10 border-b border-[#1a1a1a]/20 pb-4">
            <h2 className="text-xs tracking-[0.4em] uppercase text-[#1a1a1a]/40 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
              What I Offer
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={s.id} className="group">
                <div className="text-[10px] tracking-[0.3em] text-[#1a1a1a]/30 mb-4 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="h-px bg-[#1a1a1a]/10 mb-6 group-hover:bg-[#1a1a1a]/40 transition-colors" />
                <h3 className="text-xl font-normal mb-3 text-[#1a1a1a]" style={{ fontFamily: "'Georgia', serif" }}>
                  {s.title}
                </h3>
                {s.description && (
                  <p className="text-sm text-[#1a1a1a]/50 leading-relaxed mb-4 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {s.description}
                  </p>
                )}
                {s.price && (
                  <div className="text-sm text-[#1a1a1a]/70 italic" style={{ fontFamily: "'Georgia', serif" }}>
                    {s.price}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects — mixed editorial layout */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-8 py-16 border-t border-[#1a1a1a]/10">
          <div className="flex items-baseline gap-6 mb-10 border-b border-[#1a1a1a]/20 pb-4">
            <h2 className="text-xs tracking-[0.4em] uppercase text-[#1a1a1a]/40 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
              Selected Works
            </h2>
          </div>

          {/* First project — hero size */}
          {projects[0] && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 mb-2 bg-[#1a1a1a] group">
              {projects[0].image_url && (
                <div className="lg:col-span-3 h-72 lg:h-auto overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getProjectImageUrl(projects[0].image_url) ?? ""}
                    alt={projects[0].title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
              )}
              <div className={`${projects[0].image_url ? "lg:col-span-2" : "lg:col-span-5"} p-10 flex flex-col justify-between text-[#f5f0e8]`}>
                <div>
                  <div className="text-[10px] tracking-[0.3em] text-white/30 mb-6 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Featured
                  </div>
                  <h3 className="text-3xl font-normal mb-4" style={{ fontFamily: "'Georgia', serif" }}>
                    {projects[0].title}
                  </h3>
                  {projects[0].description && (
                    <p className="text-sm text-white/50 leading-relaxed font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                      {projects[0].description}
                    </p>
                  )}
                </div>
                <div className="flex gap-6 mt-8">
                  {projects[0].live_url && (
                    <a href={projects[0].live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                      className="flex items-center gap-2 text-xs text-white/60 hover:text-white tracking-[0.2em] uppercase transition-colors font-sans"
                      style={{ fontFamily: "system-ui, sans-serif" }}>
                      View <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                  {projects[0].github_url && (
                    <a href={projects[0].github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                      className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 tracking-[0.2em] uppercase transition-colors font-sans"
                      style={{ fontFamily: "system-ui, sans-serif" }}>
                      Code <FaGithub className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Remaining projects — row list */}
          <div className="space-y-px">
            {projects.slice(1).map((p, i) => (
              <div key={p.id} className="group flex items-center justify-between py-6 border-b border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/3 px-2 transition-colors">
                <div className="flex items-center gap-8">
                  {p.image_url && (
                    <div className="w-20 h-14 overflow-hidden shrink-0 hidden sm:block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getProjectImageUrl(p.image_url) ?? ""} alt={p.title}
                        className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] text-[#1a1a1a]/30 tracking-[0.3em] mb-1 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                      {String(i + 2).padStart(2, "0")}
                    </div>
                    <h3 className="text-lg font-normal text-[#1a1a1a]" style={{ fontFamily: "'Georgia', serif" }}>{p.title}</h3>
                    {p.description && (
                      <p className="text-xs text-[#1a1a1a]/40 mt-1 max-w-md font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                        {p.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 shrink-0">
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                      className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors">
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  )}
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                      className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors">
                      <FaGithub className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact — full-width dark band */}
      <section className="bg-[#1a1a1a] text-[#f5f0e8] mt-16">
        <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-6 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
              Let's collaborate
            </div>
            <h2 className="text-4xl sm:text-5xl font-normal leading-tight italic" style={{ fontFamily: "'Georgia', serif" }}>
              Available for new projects
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {profile.whatsapp && (
              <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)} target="_blank" rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")}
                className="flex items-center justify-between px-8 py-5 border border-white/20 hover:bg-white hover:text-[#1a1a1a] group transition-all duration-300">
                <span className="text-sm tracking-[0.2em] uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>WhatsApp</span>
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            {profile.email_contact && (
              <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")}
                className="flex items-center justify-between px-8 py-5 border border-white/10 hover:border-white/30 group transition-all duration-300">
                <span className="text-sm tracking-[0.2em] uppercase text-white/50 group-hover:text-white font-sans transition-colors" style={{ fontFamily: "system-ui, sans-serif" }}>Email</span>
                <Mail className="h-4 w-4 text-white/30 group-hover:text-white transition-colors" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      {profile.plan === "free" && (
        <footer className="bg-[#1a1a1a] border-t border-white/5 py-6 text-center">
          <a href="/" className="text-[10px] tracking-[0.3em] text-white/20 hover:text-white/40 transition-colors uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
            {APP_NAME}
          </a>
        </footer>
      )}
    </div>
  );
}