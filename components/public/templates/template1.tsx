"use client";

import { MapPin, ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

const t1Styles = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { overflow-x: hidden; }
`;

export function Template1({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  if (!profile) return null;
  const { track } = useTrack(profile.id);
  const social = profile.social_links as Record<string, string>;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #faf8f5 0%, #f0ece4 100%)", fontFamily: "'Georgia', 'Times New Roman', serif", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: t1Styles }} />

      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ── Sidebar → becomes top header on mobile ── */}
        <aside className="
          w-full lg:w-80
          lg:min-h-screen lg:sticky lg:top-0 lg:self-start
          bg-[#2c2c2c] text-[#f5f0e8]
          flex flex-col lg:justify-between
          p-8 lg:p-12
        ">
          {/* Identity block */}
          <div>
            <div className="flex flex-row lg:flex-col items-center lg:items-start gap-5 lg:gap-0 mb-0 lg:mb-10">
              {/* Avatar */}
              {profile.avatar_url ? (
                <div className="w-14 h-14 lg:w-16 lg:h-16 overflow-hidden shrink-0 lg:mb-6" style={{ borderRadius: "2px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt={profile.full_name ?? ""} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center shrink-0 border border-white/20 text-xl lg:text-2xl text-white/60 lg:mb-6" style={{ fontFamily: "'Georgia', serif", borderRadius: "2px" }}>
                  {getInitials(profile.full_name)}
                </div>
              )}

              {/* Name + headline */}
              <div className="min-w-0">
                <h1 className="text-xl lg:text-2xl font-normal leading-tight text-white" style={{ fontFamily: "'Georgia', serif" }}>
                  {profile.full_name ?? profile.username}
                </h1>
                {profile.headline && (
                  <p className="text-xs lg:text-sm text-white/40 mt-1 italic leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>{profile.headline}</p>
                )}
              </div>
            </div>

            {/* Bio — hidden on mobile to keep header compact */}
            {profile.bio && (
              <p className="hidden lg:block text-sm text-white/40 leading-relaxed mb-10 font-sans" style={{ fontFamily: "system-ui, sans-serif", fontSize: "13px" }}>
                {profile.bio}
              </p>
            )}

            {/* Meta details */}
            <div className="hidden lg:flex flex-col space-y-3 mt-6">
              {profile.location && (
                <div className="flex items-center gap-3 text-white/30">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="text-xs tracking-wider font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{profile.location}</span>
                </div>
              )}
              {profile.email_contact && (
                <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")}
                  className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="text-xs font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{profile.email_contact}</span>
                </a>
              )}
            </div>

            {/* Social icons — always visible */}
            <div className="flex gap-4 mt-5 lg:mt-8">
              {social?.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                  className="text-white/25 hover:text-white/60 transition-colors"><FaGithub className="h-4 w-4" /></a>
              )}
              {social?.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-white/25 hover:text-white/60 transition-colors"><FaLinkedin className="h-4 w-4" /></a>
              )}
              {social?.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="text-white/25 hover:text-white/60 transition-colors"><FaTwitter className="h-4 w-4" /></a>
              )}
              {social?.website && (
                <a href={social.website} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                  className="text-white/25 hover:text-white/60 transition-colors"><ArrowUpRight className="h-4 w-4" /></a>
              )}
            </div>
          </div>

          {/* CTA — inline on mobile, bottom on desktop */}
          {profile.whatsapp && (
            <div className="mt-6 lg:mt-0">
              <div className="hidden lg:block h-px bg-white/10 mb-8" />
              <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
                target="_blank" rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")}
                className="group flex items-center justify-between w-full border border-white/20 px-5 py-4 hover:bg-white hover:border-white transition-all duration-300"
              >
                <span className="text-xs tracking-[0.2em] uppercase text-white/60 group-hover:text-[#2c2c2c] transition-colors font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Start a conversation
                </span>
                <MessageCircle className="h-3.5 w-3.5 text-white/40 group-hover:text-[#2c2c2c] transition-colors" />
              </a>
            </div>
          )}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 px-5 sm:px-8 lg:px-16 py-10 lg:py-16 min-w-0">

          {/* Services */}
          {services.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-5 mb-8">
                <h2 className="text-[10px] tracking-[0.4em] uppercase text-[#2c2c2c]/30 font-sans shrink-0" style={{ fontFamily: "system-ui, sans-serif" }}>Services</h2>
                <div className="h-px flex-1 bg-[#2c2c2c]/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map(s => (
                  <div key={s.id} className="bg-white/60 border border-[#2c2c2c]/5 p-6 hover:bg-white/90 hover:border-[#2c2c2c]/10 transition-all duration-300" style={{ borderRadius: "2px" }}>
                    <h3 className="text-base font-normal text-[#2c2c2c] mb-2" style={{ fontFamily: "'Georgia', serif" }}>{s.title}</h3>
                    {s.description && <p className="text-xs text-[#2c2c2c]/50 leading-relaxed mb-4 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{s.description}</p>}
                    {s.price && <div className="text-sm italic text-[#2c2c2c]/60" style={{ fontFamily: "'Georgia', serif" }}>{s.price}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-5 mb-8">
                <h2 className="text-[10px] tracking-[0.4em] uppercase text-[#2c2c2c]/30 font-sans shrink-0" style={{ fontFamily: "system-ui, sans-serif" }}>Work</h2>
                <div className="h-px flex-1 bg-[#2c2c2c]/10" />
              </div>
              <div className="space-y-3">
                {projects.map((p, i) => (
                  <div key={p.id} className="group bg-white/50 border border-[#2c2c2c]/5 hover:bg-white/80 hover:border-[#2c2c2c]/10 transition-all duration-300 overflow-hidden" style={{ borderRadius: "2px" }}>
                    {p.image_url ? (
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-40 sm:h-auto overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={getProjectImageUrl(p.image_url) ?? ""} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="text-[10px] text-[#2c2c2c]/25 tracking-[0.3em] mb-2 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{String(i + 1).padStart(2, "0")}</div>
                            <h3 className="text-lg font-normal text-[#2c2c2c] mb-2" style={{ fontFamily: "'Georgia', serif" }}>{p.title}</h3>
                            {p.description && <p className="text-xs text-[#2c2c2c]/45 leading-relaxed font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{p.description}</p>}
                          </div>
                          <div className="flex gap-5 mt-4">
                            {p.live_url && (
                              <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                                className="flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-[#2c2c2c]/40 hover:text-[#2c2c2c] transition-colors font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                                View <ArrowUpRight className="h-3 w-3" />
                              </a>
                            )}
                            {p.github_url && (
                              <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                                className="flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-[#2c2c2c]/30 hover:text-[#2c2c2c]/60 transition-colors font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                                Code <FaGithub className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 flex items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-5 min-w-0">
                          <div className="text-[10px] text-[#2c2c2c]/25 tracking-[0.3em] font-sans shrink-0 mt-0.5 sm:mt-0" style={{ fontFamily: "system-ui, sans-serif" }}>{String(i + 1).padStart(2, "0")}</div>
                          <div className="min-w-0">
                            <h3 className="text-base font-normal text-[#2c2c2c] truncate" style={{ fontFamily: "'Georgia', serif" }}>{p.title}</h3>
                            {p.description && <p className="text-xs text-[#2c2c2c]/40 mt-1 font-sans line-clamp-2" style={{ fontFamily: "system-ui, sans-serif" }}>{p.description}</p>}
                          </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          {p.live_url && (
                            <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")} className="text-[#2c2c2c]/30 hover:text-[#2c2c2c] transition-colors">
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          )}
                          {p.github_url && (
                            <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")} className="text-[#2c2c2c]/30 hover:text-[#2c2c2c] transition-colors">
                              <FaGithub className="h-4 w-4" />
                            </a>
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
          <section>
            <div className="flex items-center gap-5 mb-8">
              <h2 className="text-[10px] tracking-[0.4em] uppercase text-[#2c2c2c]/30 font-sans shrink-0" style={{ fontFamily: "system-ui, sans-serif" }}>Contact</h2>
              <div className="h-px flex-1 bg-[#2c2c2c]/10" />
            </div>
            <div className="bg-white/60 border border-[#2c2c2c]/5 p-8 sm:p-10" style={{ borderRadius: "2px" }}>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2c2c2c] mb-3 leading-snug" style={{ fontFamily: "'Georgia', serif" }}>
                Open to new<br /><em>opportunities</em>
              </h3>
              <p className="text-sm text-[#2c2c2c]/50 mb-8 font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>
                Whether it's a project, a role, or just a conversation — reach out.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                {profile.whatsapp && (
                  <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)} target="_blank" rel="noopener noreferrer"
                    onClick={() => track("whatsapp_click")}
                    className="flex items-center justify-center gap-2 bg-[#2c2c2c] text-white px-6 py-3.5 hover:bg-[#444] transition-colors font-sans text-sm tracking-[0.15em] uppercase" style={{ fontFamily: "system-ui, sans-serif", borderRadius: "2px" }}>
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                {profile.email_contact && (
                  <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")}
                    className="flex items-center justify-center gap-2 border border-[#2c2c2c]/20 text-[#2c2c2c]/60 px-6 py-3.5 hover:border-[#2c2c2c]/40 hover:text-[#2c2c2c] transition-colors font-sans text-sm tracking-[0.15em] uppercase" style={{ fontFamily: "system-ui, sans-serif", borderRadius: "2px" }}>
                    <Mail className="h-4 w-4" /> Email
                  </a>
                )}
              </div>
            </div>
          </section>

          {profile.plan === "free" && (
            <div className="mt-16 pt-8 border-t border-[#2c2c2c]/10 text-center">
              <a href="/" className="text-[10px] tracking-[0.3em] text-[#2c2c2c]/20 hover:text-[#2c2c2c]/40 transition-colors uppercase font-sans" style={{ fontFamily: "system-ui, sans-serif" }}>{APP_NAME}</a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}