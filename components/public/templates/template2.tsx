"use client";

import { MapPin, ArrowUpRight, Mail, MessageCircle, ExternalLink, Link as LinkIcon } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

const DEFAULT_ACCENT = "#FF3B00";
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

export function Template2({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  if (!profile) return null;
  const { track } = useTrack(profile.id);
  const social = (profile.social_links ?? {}) as Record<string, string | null | undefined>;
  const extraLinks = getExtraLinks(social);
  const accent = (profile as unknown as Record<string, unknown>).accent_color as string | undefined ?? DEFAULT_ACCENT;
  const fontId = (profile as unknown as Record<string, unknown>).font_id as string | undefined ?? "sans";
  const font = FONT_MAP[fontId] ?? FONT_MAP.sans;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    .t2-body { font-family: ${font}; }
    .t2-proj {
      display: flex; flex-direction: column;
      border: 1.5px solid #e8e8e8;
      overflow: hidden;
      transition: border-color 200ms, box-shadow 200ms;
      background: #fff;
    }
    .t2-proj:hover { border-color: ${accent}; box-shadow: 6px 6px 0 ${accent}; }
    .t2-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 12px; border-radius: 999px;
      background: ${accent}; color: #fff;
      font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      font-family: ${font};
    }
    .t2-tag {
      display: inline-block; padding: 3px 10px;
      border: 1.5px solid #e8e8e8; font-size: 11px;
      color: #666; letter-spacing: 0.05em;
    }
    .t2-cta {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 24px; font-size: 12px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      text-decoration: none; font-family: ${font};
      transition: all 150ms; border: 2px solid;
    }
    .t2-cta-fill { background: ${accent}; color: #fff; border-color: ${accent}; }
    .t2-cta-fill:hover { background: transparent; color: ${accent}; }
    .t2-cta-outline { background: transparent; color: #111; border-color: #111; }
    .t2-cta-outline:hover { background: #111; color: #fff; }
    .t2-number {
      font-size: 80px; font-weight: 800; line-height: 1;
      color: ${accent}; opacity: 0.12; position: absolute;
      top: -10px; right: 16px; pointer-events: none;
      font-family: ${font};
    }
    .t2-divider {
      width: 40px; height: 3px; background: ${accent}; margin-bottom: 24px;
    }
    .t2-social { 
      color: #bbb; transition: color 150ms; text-decoration: none;
    }
    .t2-social:hover { color: ${accent}; }
  `;

  const name = profile.full_name ?? profile.username;
  const initials = getInitials(profile.full_name);

  return (
    <div className="t2-body" style={{ minHeight: "100vh", background: "#f5f3f0", color: "#111" }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ── TOP NAV ── */}
      <nav style={{ background: "#fff", borderBottom: "1.5px solid #e8e8e8", padding: "0 40px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {profile.avatar_url
            ? <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            : <div style={{ width: 32, height: 32, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>{initials}</div>
          }
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>{name}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {profile.whatsapp && (
            <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)} target="_blank" rel="noopener noreferrer"
              onClick={() => track("whatsapp_click")} className="t2-cta t2-cta-fill" style={{ padding: "7px 16px", fontSize: 11 }}>
              <MessageCircle size={12} /> Contact
            </a>
          )}
        </div>
      </nav>

      {/* ── HERO STRIP ── */}
      <section style={{ background: "#fff", borderBottom: "1.5px solid #e8e8e8", padding: "60px 40px 48px", overflow: "hidden", position: "relative" }}>
        {/* Big decorative name behind */}
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: "clamp(80px, 12vw, 160px)", fontWeight: 800, color: `${accent}08`, lineHeight: 1, pointerEvents: "none", letterSpacing: "-0.04em", whiteSpace: "nowrap", fontFamily: FONT_MAP.sans }}>
          {name}
        </div>

        <div style={{ maxWidth: 700, position: "relative" }}>
          <div style={{ marginBottom: 20 }}>
            <span className="t2-pill"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)", display: "inline-block" }} /> Portfolio</span>
          </div>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", margin: "0 0 20px", fontFamily: FONT_MAP.sans }}>
            {name.split(" ").map((word, i) => (
              <span key={i} style={{ display: "block" }}>
                {i === 0 ? word : <span style={{ WebkitTextStroke: "2px #111", WebkitTextFillColor: "transparent" }}>{word}</span>}
              </span>
            ))}
          </h1>
          {profile.headline && (
            <p style={{ fontSize: 16, color: "#666", margin: "0 0 28px", maxWidth: 480, lineHeight: 1.6 }}>{profile.headline}</p>
          )}
          {profile.bio && (
            <p style={{ fontSize: 14, color: "#888", maxWidth: 500, lineHeight: 1.75, margin: "0 0 32px" }}>{profile.bio}</p>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {profile.whatsapp && (
              <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)} target="_blank" rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")} className="t2-cta t2-cta-fill">
                <MessageCircle size={13} /> WhatsApp
              </a>
            )}
            {profile.email_contact && (
              <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")} className="t2-cta t2-cta-outline">
                <Mail size={13} /> Email
              </a>
            )}
          </div>
          {profile.location && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 20, fontSize: 12, color: "#aaa" }}>
              <MapPin size={11} /> {profile.location}
            </div>
          )}
        </div>
      </section>

      {/* ── BODY ── */}
      <main style={{ maxWidth: 1060, margin: "0 auto", padding: "56px 40px 80px" }}>

        {/* Services */}
        {services.length > 0 && (
          <section style={{ marginBottom: 72 }}>
            <div className="t2-divider" />
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: 28, fontFamily: FONT_MAP.sans }}>
              What I Do
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
              {services.map((s, i) => (
                <div key={s.id} style={{ position: "relative", padding: "28px 24px", background: "#fff", border: "1.5px solid #e8e8e8", overflow: "hidden" }}>
                  <div className="t2-number">{String(i + 1).padStart(2, "0")}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{s.title}</h3>
                  {s.description && <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, margin: "0 0 12px" }}>{s.description}</p>}
                  {s.price && <span className="t2-tag">{s.price}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 72 }}>
            <div className="t2-divider" />
            <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: 28, fontFamily: FONT_MAP.sans }}>
              Selected Work
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {projects.map((p, i) => (
                <div key={p.id} className="t2-proj">
                  {p.image_url ? (
                    <div style={{ height: 200, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                      <img src={getProjectImageUrl(p.image_url) ?? ""} alt={p.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 400ms" }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                      {/* Index badge */}
                      <div style={{ position: "absolute", top: 12, left: 12, background: accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", letterSpacing: "0.08em" }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                  ) : (
                    <div style={{ height: 80, background: `${accent}10`, display: "flex", alignItems: "center", padding: "0 20px" }}>
                      <span style={{ fontSize: 32, fontWeight: 800, color: `${accent}30`, fontFamily: FONT_MAP.sans }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                  <div style={{ padding: "20px 20px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{p.title}</h3>
                    {p.description && (
                      <p style={{ fontSize: 12, color: "#888", lineHeight: 1.65, flex: 1, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.description}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 12 }}>
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                          style={{ fontSize: 11, fontWeight: 700, color: accent, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Live <ArrowUpRight size={11} />
                        </a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                          style={{ fontSize: 11, color: "#bbb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Code <FaGithub size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact + Socials */}
        <section>
          <div className="t2-divider" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div>
              <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: 28, fontFamily: FONT_MAP.sans }}>
                Get In Touch
              </h2>
              <h3 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 20px", fontFamily: FONT_MAP.sans }}>
                Let's build<br />
                <span style={{ WebkitTextStroke: "2px #111", WebkitTextFillColor: "transparent" }}>something.</span>
              </h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {profile.whatsapp && (
                  <a href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)} target="_blank" rel="noopener noreferrer"
                    onClick={() => track("whatsapp_click")} className="t2-cta t2-cta-fill">
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                )}
                {profile.email_contact && (
                  <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")} className="t2-cta t2-cta-outline">
                    <Mail size={13} /> Email
                  </a>
                )}
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: 28, fontFamily: FONT_MAP.sans }}>
                Follow
              </h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {social?.github && <a href={social.github as string} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")} className="t2-social"><FaGithub size={22} /></a>}
                {social?.linkedin && <a href={social.linkedin as string} target="_blank" rel="noopener noreferrer" className="t2-social"><FaLinkedin size={22} /></a>}
                {social?.twitter && <a href={social.twitter as string} target="_blank" rel="noopener noreferrer" className="t2-social"><FaTwitter size={22} /></a>}
                {social?.instagram && <a href={social.instagram as string} target="_blank" rel="noopener noreferrer" className="t2-social"><FaInstagram size={22} /></a>}
                {social?.tiktok && <a href={social.tiktok as string} target="_blank" rel="noopener noreferrer" className="t2-social"><FaTiktok size={22} /></a>}
              </div>
              {extraLinks.length > 0 && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  {extraLinks.map(el => (
                    <a key={el.url} href={el.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#aaa", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = accent)} onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}>
                      <LinkIcon size={12} /> {el.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {profile.plan === "free" && (
        <div style={{ borderTop: "1.5px solid #e8e8e8", padding: "16px 40px", textAlign: "center", background: "#fff" }}>
          <a href="/" style={{ fontSize: 10, color: "#ccc", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase" }}>{APP_NAME}</a>
        </div>
      )}
    </div>
  );
}