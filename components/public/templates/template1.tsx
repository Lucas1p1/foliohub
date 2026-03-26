"use client";

import { MapPin, ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export function Template1({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  if (!profile) return null;
  const { track } = useTrack(profile.id);
  const social = profile.social_links as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Subtle grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Thin gold top border */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent z-50" />

      {/* Nav */}
      <nav className="relative z-10 max-w-5xl mx-auto px-8 py-8 flex items-center justify-between">
        <div className="text-xs tracking-[0.3em] text-[#c9a96e] uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
          {profile.username}
        </div>
        <div className="flex items-center gap-6">
          {social?.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
              className="text-white/30 hover:text-[#c9a96e] transition-colors duration-300">
              <FaGithub className="h-4 w-4" />
            </a>
          )}
          {social?.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-white/30 hover:text-[#c9a96e] transition-colors duration-300">
              <FaLinkedin className="h-4 w-4" />
            </a>
          )}
          {social?.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer"
              className="text-white/30 hover:text-[#c9a96e] transition-colors duration-300">
              <FaTwitter className="h-4 w-4" />
            </a>
          )}
          {profile.whatsapp && (
            <a
              href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click")}
              className="text-xs tracking-[0.2em] uppercase border border-[#c9a96e]/40 text-[#c9a96e] px-5 py-2 hover:bg-[#c9a96e] hover:text-black transition-all duration-300 font-sans"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Enquire
            </a>
          )}
        </div>
      </nav>

      {/* Hero — editorial split layout */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            {/* Decorative line + label */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-12 bg-[#c9a96e]" />
              <span className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                Portfolio
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight mb-8"
              style={{ fontFamily: "'Georgia', serif" }}>
              {profile.full_name ?? profile.username}
            </h1>

            {profile.headline && (
              <p className="text-lg text-white/50 italic mb-8 leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
                {profile.headline}
              </p>
            )}

            {profile.location && (
              <div className="flex items-center gap-2 text-white/30 text-sm font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                <MapPin className="h-3.5 w-3.5" />
                <span className="tracking-widest text-xs uppercase">{profile.location}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start lg:items-end gap-8">
            {/* Avatar — portrait style */}
            <div className="relative">
              <div className="w-48 h-60 overflow-hidden" style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)" }}>
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getAvatarUrl(profile.avatar_url) ?? ""}
                    alt={profile.full_name ?? ""}
                    className="w-full h-full object-cover grayscale"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-4xl text-[#c9a96e]" style={{ fontFamily: "'Georgia', serif" }}>
                    {getInitials(profile.full_name)}
                  </div>
                )}
              </div>
              {/* Gold corner accent */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#c9a96e]" />
            </div>

            {profile.bio && (
              <p className="text-sm text-white/40 leading-relaxed max-w-xs text-right font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="mt-20 flex items-center gap-6">
          <div className="h-px flex-1 bg-white/5" />
          <div className="w-1 h-1 rounded-full bg-[#c9a96e]" />
          <div className="h-px w-16 bg-white/5" />
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="relative z-10 max-w-5xl mx-auto px-8 py-20">
          <div className="flex items-center gap-6 mb-14">
            <span className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
              Services
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {services.map((s, i) => (
              <div key={s.id} className="bg-[#080808] p-8 group hover:bg-[#0f0f0f] transition-colors duration-500">
                <div className="text-[10px] text-[#c9a96e]/50 tracking-[0.3em] mb-6 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                  0{i + 1}
                </div>
                <h3 className="text-lg font-normal mb-3" style={{ fontFamily: "'Georgia', serif" }}>{s.title}</h3>
                {s.description && (
                  <p className="text-sm text-white/30 leading-relaxed mb-6 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{s.description}</p>
                )}
                {s.price && (
                  <div className="text-[#c9a96e] text-sm tracking-wider font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{s.price}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="relative z-10 max-w-5xl mx-auto px-8 py-20">
          <div className="flex items-center gap-6 mb-14">
            <span className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
              Selected Work
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="space-y-px">
            {projects.map((p, i) => (
              <div key={p.id} className="group relative bg-[#080808] hover:bg-[#0d0d0d] transition-all duration-500 border-b border-white/5">
                {p.image_url ? (
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                    <div className="lg:col-span-2 overflow-hidden h-48 lg:h-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getProjectImageUrl(p.image_url) ?? ""}
                        alt={p.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      />
                    </div>
                    <div className="lg:col-span-3 p-10 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-white/20 tracking-[0.3em] mb-4 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 className="text-2xl font-normal mb-3" style={{ fontFamily: "'Georgia', serif" }}>{p.title}</h3>
                        {p.description && (
                          <p className="text-sm text-white/30 leading-relaxed font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{p.description}</p>
                        )}
                      </div>
                      <div className="flex gap-6 mt-8">
                        {p.live_url && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                            className="flex items-center gap-2 text-xs text-[#c9a96e] tracking-[0.2em] uppercase hover:gap-4 transition-all duration-300 font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}>
                            View Project <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                            className="flex items-center gap-2 text-xs text-white/30 tracking-[0.2em] uppercase hover:text-white/60 transition-colors font-sans"
                            style={{ fontFamily: "system-ui, sans-serif" }}>
                            Source <FaGithub className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-white/20 tracking-[0.3em] mb-3 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Georgia', serif" }}>{p.title}</h3>
                      {p.description && (
                        <p className="text-sm text-white/30 max-w-lg font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{p.description}</p>
                      )}
                    </div>
                    <div className="flex gap-4 shrink-0 ml-8">
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                          className="text-[#c9a96e]"><ArrowUpRight className="h-5 w-5" /></a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                          className="text-white/30 hover:text-white/60 transition-colors"><FaGithub className="h-5 w-5" /></a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#c9a96e]" />
              <span className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                Contact
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-normal leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
              Let's create<br />
              <em>something remarkable</em>
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {profile.whatsapp && (
              <a
                href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")}
                className="group flex items-center justify-between border border-[#c9a96e]/30 px-8 py-5 hover:bg-[#c9a96e] hover:border-[#c9a96e] transition-all duration-300"
              >
                <span className="text-sm tracking-[0.2em] uppercase text-[#c9a96e] group-hover:text-black transition-colors font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                  WhatsApp
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#c9a96e] group-hover:text-black transition-colors" />
              </a>
            )}
            {profile.email_contact && (
              <a
                href={`mailto:${profile.email_contact}`}
                onClick={() => track("email_click")}
                className="group flex items-center justify-between border border-white/10 px-8 py-5 hover:border-white/30 transition-all duration-300"
              >
                <span className="text-sm tracking-[0.2em] uppercase text-white/50 group-hover:text-white transition-colors font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Email
                </span>
                <Mail className="h-4 w-4 text-white/30 group-hover:text-white transition-colors" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto px-8 py-8 border-t border-white/5 flex items-center justify-between">
        {profile.plan === "free" && (
          <a href="/" className="text-[10px] tracking-[0.3em] text-white/15 hover:text-white/30 transition-colors uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
            {APP_NAME}
          </a>
        )}
        <div className="ml-auto text-[10px] tracking-[0.3em] text-white/15 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
          {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}