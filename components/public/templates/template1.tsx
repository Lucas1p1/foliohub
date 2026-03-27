"use client";

import { MapPin, ArrowUpRight, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

// ── Default accent & font (overridden by profile.accent_color / profile.font_id) ──
const DEFAULT_ACCENT = "#e8ff47";
const FONT_MAP: Record<string, string> = {
  mono:    "'DM Mono', 'Fira Code', monospace",
  serif:   "'Playfair Display', Georgia, serif",
  sans:    "'Syne', system-ui, sans-serif",
  display: "'Space Grotesk', system-ui, sans-serif",
};

function getExtraLinks(social: Record<string, string | null | undefined>) {
  const links: { label: string; url: string }[] = [];
  let i = 0;
  while (social[`extra_${i}_label`] !== undefined || social[`extra_${i}_url`] !== undefined) {
    const label = social[`extra_${i}_label`] ?? "";
    const url = social[`extra_${i}_url`] ?? "";
    if (url) links.push({ label: label || url, url });
    i++;
  }
  return links;
}

export function Template1({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  if (!profile) return null;
  const { track } = useTrack(profile.id);
  const social = (profile.social_links ?? {}) as Record<string, string | null | undefined>;
  const extraLinks = getExtraLinks(social);
  const accent = (profile as Record<string, unknown>).accent_color as string | undefined ?? DEFAULT_ACCENT;
  const fontId = (profile as Record<string, unknown>).font_id as string | undefined ?? "mono";
  const font = FONT_MAP[fontId] ?? FONT_MAP.mono;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    .t1-body { font-family: ${font}; }
    .t1-accent { color: ${accent}; }
    .t1-accent-bg { background: ${accent}; }
    .t1-accent-border { border-color: ${accent}; }
    .t1-tag { 
      display: inline-block; padding: 2px 8px; border: 1px solid ${accent}33;
      color: ${accent}; font-size: 10px; letter-spacing: 0.12em;
      text-transform: uppercase; border-radius: 2px;
    }
    .t1-btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: ${accent}; color: #050505; border: none;
      padding: 10px 20px; font-size: 12px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      cursor: pointer; text-decoration: none; font-family: ${font};
      transition: opacity 150ms;
    }
    .t1-btn-primary:hover { opacity: 0.85; }
    .t1-btn-outline {
      display: inline-flex; align-items: center; gap: 8px;
      border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.5);
      padding: 10px 20px; font-size: 12px; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase;
      cursor: pointer; text-decoration: none; font-family: ${font};
      transition: all 150ms;
    }
    .t1-btn-outline:hover { border-color: ${accent}66; color: ${accent}; }
    .t1-proj-card {
      border: 1px solid rgba(255,255,255,0.05);
      background: #0d0d0d;
      transition: border-color 200ms, transform 200ms;
    }
    .t1-proj-card:hover {
      border-color: ${accent}44;
      transform: translateY(-2px);
    }
    .t1-scan {
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, ${accent}, transparent);
      animation: t1-scanline 3s ease-in-out infinite;
    }
    @keyframes t1-scanline {
      0%, 100% { transform: translateX(-100%); opacity: 0; }
      50% { transform: translateX(100%); opacity: 1; }
    }
    .t1-social-icon { color: rgba(255,255,255,0.2); transition: color 150ms; text-decoration: none; }
    .t1-social-icon:hover { color: ${accent}; }
    .t1-blink { animation: t1-blink 1.2s step-end infinite; }
    @keyframes t1-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    .t1-noise {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none; z-index: 0; opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
  `;

  return (
    <div className="t1-body" style={{ minHeight: "100vh", background: "#060606", color: "#c8c8c8", position: "relative" }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="t1-noise" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* ── HEADER ── */}
        <header style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "32px 0 28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: 4, overflow: "hidden", border: `1px solid ${accent}33`, position: "relative" }}>
                {profile.avatar_url
                  ? <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: accent, fontWeight: 700 }}>{getInitials(profile.full_name)}</div>
                }
              </div>
              {/* Online indicator */}
              <div style={{ position: "absolute", bottom: -3, right: -3, width: 14, height: 14, background: accent, borderRadius: "50%", border: "2px solid #060606" }} />
            </div>

            {/* Identity */}
            <div>
              <div style={{ fontSize: 10, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
                <span className="t1-blink">█</span> AVAILABLE FOR WORK
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em", fontFamily: FONT_MAP.sans }}>
                {profile.full_name ?? profile.username}
              </h1>
              {profile.headline && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, fontWeight: 400 }}>
                  {/* Accent first word */}
                  <span style={{ color: accent }}>{profile.headline.split("·")[0]?.trim()}</span>
                  {profile.headline.includes("·") && <span> · {profile.headline.split("·").slice(1).join("·").trim()}</span>}
                </p>
              )}
              {profile.location && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                  <MapPin size={10} /> {profile.location}
                </div>
              )}
            </div>
          </div>

          {/* Contact CTA */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {profile.whatsapp && (
              <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)} target="_blank" rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")} className="t1-btn-primary">
                <MessageCircle size={13} /> WhatsApp
              </a>
            )}
            {profile.email_contact && (
              <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")} className="t1-btn-outline">
                <Mail size={13} /> Email
              </a>
            )}
          </div>
        </header>

        {/* ── MAIN GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 0, minHeight: "calc(100vh - 140px)" }}>

          {/* LEFT — content */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)", paddingRight: 40, paddingTop: 40, paddingBottom: 60 }}>

            {/* Bio */}
            {profile.bio && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 10, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
                  // ABOUT
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", maxWidth: 540, margin: 0 }}>
                  {profile.bio}
                </p>
              </section>
            )}

            {/* Services */}
            {services.length > 0 && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 10, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20, fontWeight: 600 }}>
                  // SERVICES
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {services.map(s => (
                    <div key={s.id} style={{ padding: "16px 18px", border: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d", borderRadius: 4 }}>
                      <div style={{ fontSize: 13, color: "#e8e8e8", marginBottom: 6, fontWeight: 500 }}>{s.title}</div>
                      {s.description && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 0 10px", lineHeight: 1.6 }}>{s.description}</p>}
                      {s.price && <div className="t1-tag">{s.price}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <div style={{ fontSize: 10, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20, fontWeight: 600 }}>
                  // PROJECTS({projects.length})
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                  {projects.map((p, i) => (
                    <div key={p.id} className="t1-proj-card" style={{ borderRadius: 4, overflow: "hidden", position: "relative" }}>
                      {p.image_url && (
                        <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                          <img src={getProjectImageUrl(p.image_url) ?? ""} alt={p.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <div className="t1-scan" />
                          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, #0d0d0d)` }} />
                        </div>
                      )}
                      <div style={{ padding: "16px 16px 14px" }}>
                        <div style={{ fontSize: 10, color: accent, letterSpacing: "0.12em", marginBottom: 6, fontWeight: 600 }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 style={{ fontSize: 14, color: "#e8e8e8", margin: "0 0 6px", fontWeight: 600 }}>{p.title}</h3>
                        {p.description && (
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 0 12px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.description}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: 12 }}>
                          {p.live_url && (
                            <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                              style={{ fontSize: 10, color: accent, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                              <ExternalLink size={10} /> LIVE
                            </a>
                          )}
                          {p.github_url && (
                            <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                              style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 150ms" }}>
                              <FaGithub size={10} /> CODE
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT — sidebar */}
          <div style={{ paddingLeft: 32, paddingTop: 40 }}>
            {/* Socials */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
                LINKS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {social?.github && (
                  <a href={social.github as string} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                    style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 150ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                    <FaGithub size={14} /> GitHub
                  </a>
                )}
                {social?.linkedin && (
                  <a href={social.linkedin as string} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 150ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                    <FaLinkedin size={14} /> LinkedIn
                  </a>
                )}
                {social?.twitter && (
                  <a href={social.twitter as string} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 150ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                    <FaTwitter size={14} /> Twitter / X
                  </a>
                )}
                {social?.instagram && (
                  <a href={social.instagram as string} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 150ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                    <FaInstagram size={14} /> Instagram
                  </a>
                )}
                {extraLinks.map(el => (
                  <a key={el.url} href={el.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 150ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                    <ExternalLink size={14} /> {el.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ padding: "16px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4, background: "#0a0a0a", marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>STATS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Projects", val: projects.length },
                  { label: "Services", val: services.length },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{s.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: accent }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {profile.plan === "free" && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 0", textAlign: "center" }}>
            <a href="/" style={{ fontSize: 10, color: "rgba(255,255,255,0.1)", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase" }}>{APP_NAME}</a>
          </div>
        )}
      </div>
    </div>
  );
}