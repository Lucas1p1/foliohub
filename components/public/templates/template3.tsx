"use client";

import { MapPin, Mail, MessageCircle, ExternalLink, Link as LinkIcon } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

const DEFAULT_ACCENT = "#7C5CFC";
const FONT_MAP: Record<string, string> = {
  mono:    "'DM Mono', monospace",
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

export function Template3({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  if (!profile) return null;
  const { track } = useTrack(profile.id);
  const social = (profile.social_links ?? {}) as Record<string, string | null | undefined>;
  const extraLinks = getExtraLinks(social);
  const accent = (profile as unknown as Record<string, unknown>).accent_color as string | undefined ?? DEFAULT_ACCENT;
  const fontId = (profile as unknown as Record<string, unknown>).font_id as string | undefined ?? "serif";
  const font = FONT_MAP[fontId] ?? FONT_MAP.serif;

  // Compute a soft tinted bg from accent
  const accentRgb = hexToRgb(accent);
  const tint = accentRgb ? `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.06)` : "#f5f0ff";

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Mono:wght@300;400&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    .t3-body { font-family: ${font}; }
    .t3-section-label {
      font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
      text-transform: uppercase; color: ${accent}; margin-bottom: 28px;
      display: flex; align-items: center; gap: 12px;
      font-family: 'DM Mono', monospace;
    }
    .t3-section-label::after {
      content: ""; flex: 1; height: 1px; background: linear-gradient(to right, ${accent}33, transparent);
    }
    .t3-card {
      background: rgba(255,255,255,0.8);
      border: 1px solid rgba(0,0,0,0.07);
      backdrop-filter: blur(8px);
      border-radius: 12px;
      transition: transform 200ms, box-shadow 200ms;
    }
    .t3-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.08);
    }
    .t3-link-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 999px;
      background: rgba(0,0,0,0.05); color: #555;
      font-size: 12px; text-decoration: none;
      transition: all 150ms; font-family: 'DM Mono', monospace;
    }
    .t3-link-chip:hover { background: ${accent}; color: #fff; }
    .t3-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 24px; border-radius: 999px;
      font-size: 13px; font-weight: 600; text-decoration: none;
      letter-spacing: 0.02em; transition: all 200ms;
      font-family: ${font};
    }
    .t3-btn-fill { background: ${accent}; color: #fff; box-shadow: 0 4px 16px ${accent}44; }
    .t3-btn-fill:hover { box-shadow: 0 6px 24px ${accent}66; transform: translateY(-1px); }
    .t3-btn-outline { border: 1.5px solid rgba(0,0,0,0.12); color: #333; }
    .t3-btn-outline:hover { border-color: ${accent}; color: ${accent}; }
    .t3-social { 
      width: 40px; height: 40px; border-radius: 50%; 
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.05); color: #555;
      text-decoration: none; transition: all 150ms;
    }
    .t3-social:hover { background: ${accent}; color: #fff; }
    .t3-proj-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 500ms; }
    .t3-proj-wrap:hover .t3-proj-img { transform: scale(1.05); }
    .t3-gradient-orb {
      position: fixed; border-radius: 50%; pointer-events: none;
      filter: blur(60px); opacity: 0.3;
    }
  `;

  return (
    <div className="t3-body" style={{ minHeight: "100vh", background: `linear-gradient(135deg, #fdfcfb 0%, ${tint} 50%, #fdfcfb 100%)`, color: "#222", position: "relative", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Decorative orbs */}
      <div className="t3-gradient-orb" style={{ width: 400, height: 400, background: accent, top: -100, right: -100 }} />
      <div className="t3-gradient-orb" style={{ width: 300, height: 300, background: accent, bottom: 100, left: -80, opacity: 0.15 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "60px 32px 80px" }}>

        {/* ── PROFILE HEADER ── */}
        <header style={{ textAlign: "center", marginBottom: 64 }}>
          {/* Avatar ring */}
          <div style={{ display: "inline-block", padding: 3, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent}66)`, marginBottom: 20 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {profile.avatar_url
                ? <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ fontSize: 28, fontWeight: 700, color: accent }}>{getInitials(profile.full_name)}</div>
              }
            </div>
          </div>

          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            {profile.full_name ?? profile.username}
          </h1>
          {profile.headline && (
            <p style={{ fontSize: 16, color: "#888", margin: "0 0 16px", fontStyle: fontId === "serif" ? "italic" : "normal" }}>
              {profile.headline}
            </p>
          )}
          {profile.location && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 12, color: "#aaa", marginBottom: 24 }}>
              <MapPin size={11} /> {profile.location}
            </div>
          )}

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            {profile.whatsapp && (
              <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)} target="_blank" rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")} className="t3-btn t3-btn-fill">
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
            {profile.email_contact && (
              <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")} className="t3-btn t3-btn-outline">
                <Mail size={14} /> Email
              </a>
            )}
          </div>

          {/* Social row */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {social?.github && <a href={social.github as string} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")} className="t3-social"><FaGithub size={16} /></a>}
            {social?.linkedin && <a href={social.linkedin as string} target="_blank" rel="noopener noreferrer" className="t3-social"><FaLinkedin size={16} /></a>}
            {social?.twitter && <a href={social.twitter as string} target="_blank" rel="noopener noreferrer" className="t3-social"><FaTwitter size={16} /></a>}
            {social?.instagram && <a href={social.instagram as string} target="_blank" rel="noopener noreferrer" className="t3-social"><FaInstagram size={16} /></a>}
            {social?.tiktok && <a href={social.tiktok as string} target="_blank" rel="noopener noreferrer" className="t3-social"><FaTiktok size={16} /></a>}
            {extraLinks.map(el => (
              <a key={el.url} href={el.url} target="_blank" rel="noopener noreferrer" className="t3-link-chip" title={el.label}>
                <LinkIcon size={12} /> {el.label}
              </a>
            ))}
          </div>
        </header>

        {/* ── BIO ── */}
        {profile.bio && (
          <section style={{ marginBottom: 56, background: "rgba(255,255,255,0.7)", borderRadius: 16, padding: "28px 32px", border: "1px solid rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "#555", margin: 0, fontStyle: fontId === "serif" ? "italic" : "normal" }}>
              "{profile.bio}"
            </p>
          </section>
        )}

        {/* ── SERVICES ── */}
        {services.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <div className="t3-section-label">Services</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {services.map(s => (
                <div key={s.id} className="t3-card" style={{ padding: "22px 22px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 8px" }}>{s.title}</h3>
                  {s.description && <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, margin: "0 0 12px" }}>{s.description}</p>}
                  {s.price && (
                    <span style={{ fontSize: 12, color: accent, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{s.price}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <div className="t3-section-label">Work</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {projects.map((p, i) => (
                <div key={p.id} className="t3-card t3-proj-wrap" style={{ overflow: "hidden" }}>
                  <div style={{ display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse", gap: 0 }}>
                    {p.image_url && (
                      <div style={{ width: 220, minHeight: 160, flexShrink: 0, overflow: "hidden" }}>
                        <img src={getProjectImageUrl(p.image_url) ?? ""} alt={p.title} className="t3-proj-img" style={{ height: "100%" }} />
                      </div>
                    )}
                    <div style={{ padding: "24px 26px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ fontSize: 10, color: accent, fontFamily: "'DM Mono', monospace", marginBottom: 8, letterSpacing: "0.1em" }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{p.title}</h3>
                      {p.description && (
                        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, margin: "0 0 16px" }}>{p.description}</p>
                      )}
                      <div style={{ display: "flex", gap: 10 }}>
                        {p.live_url && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                            className="t3-link-chip">
                            <ExternalLink size={11} /> View
                          </a>
                        )}
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                            className="t3-link-chip">
                            <FaGithub size={11} /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CONTACT ── */}
        <section style={{ textAlign: "center", padding: "48px 32px", background: `linear-gradient(135deg, ${accent}08, ${accent}14)`, borderRadius: 20, border: `1px solid ${accent}22` }}>
          <div style={{ fontSize: 10, color: accent, fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", marginBottom: 16 }}>GET IN TOUCH</div>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Let's work together
          </h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.6 }}>
            Whether it's a project, a role, or just a conversation — I'm open.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {profile.whatsapp && (
              <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)} target="_blank" rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")} className="t3-btn t3-btn-fill">
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
            {profile.email_contact && (
              <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")} className="t3-btn t3-btn-outline">
                <Mail size={14} /> {profile.email_contact}
              </a>
            )}
          </div>
        </section>

        {profile.plan === "free" && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="/" style={{ fontSize: 10, color: "#ccc", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase" }}>{APP_NAME}</a>
          </div>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}