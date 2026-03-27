"use client";

import {
  MapPin,
  Mail,
  MessageCircle,
  ExternalLink,
  Github,
  Link as LinkIcon,
} from "lucide-react";
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { useTrack } from "@/lib/use-track";
import {
  getAvatarUrl,
  getInitials,
  getProjectImageUrl,
  getWhatsAppUrl,
} from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

const DEFAULT_ACCENT = "#B7FF3C";

const FONT_MAP: Record<string, string> = {
  mono: "'DM Mono', 'Fira Code', monospace",
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Syne', system-ui, sans-serif",
  display: "'Space Grotesk', system-ui, sans-serif",
};

function getExtraLinks(social: Record<string, string | null | undefined>) {
  const links: { label: string; url: string }[] = [];
  let i = 0;

  while (
    social[`extra_${i}_label`] !== undefined ||
    social[`extra_${i}_url`] !== undefined
  ) {
    const label = social[`extra_${i}_label`] ?? "";
    const url = social[`extra_${i}_url`] ?? "";
    if (url) links.push({ label: label || url, url });
    i++;
  }

  return links;
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function Template1({
  data: { profile, projects, services },
}: {
  data: PublicProfileData;
}) {
  if (!profile) return null;

  const { track } = useTrack(profile.id);
  const social = (profile.social_links ?? {}) as Record<
    string,
    string | null | undefined
  >;
  const extraLinks = getExtraLinks(social);

  const accent =
    ((profile as unknown as Record<string, unknown>).accent_color as
      | string
      | undefined) ?? DEFAULT_ACCENT;

  const fontId =
    ((profile as unknown as Record<string, unknown>).font_id as
      | string
      | undefined) ?? "mono";

  const font = FONT_MAP[fontId] ?? FONT_MAP.mono;
  const name = profile.full_name ?? profile.username;
  const initials = getInitials(profile.full_name);
  const availableServices = services.slice(0, 6);
  const featuredProjects = projects.slice(0, 8);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    .t1-root {
      font-family: ${font};
      min-height: 100vh;
      background:
        radial-gradient(circle at top right, ${accent}12, transparent 28%),
        radial-gradient(circle at bottom left, ${accent}10, transparent 24%),
        #050505;
      color: #d6d6d6;
      position: relative;
      overflow: hidden;
    }

    .t1-noise {
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.03;
      z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    .t1-scanline {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background: linear-gradient(
        to bottom,
        rgba(255,255,255,0.015) 0%,
        rgba(255,255,255,0) 50%,
        rgba(255,255,255,0.015) 100%
      );
      background-size: 100% 6px;
      opacity: 0.35;
    }

    .t1-shell {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 28px 22px 40px;
    }

    .t1-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      padding: 12px 16px;
      backdrop-filter: blur(10px);
    }

    .t1-dots {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .t1-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.18);
    }

    .t1-dot.accent {
      background: ${accent};
      box-shadow: 0 0 12px ${accent};
    }

    .t1-topbar-title {
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .t1-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${accent};
    }

    .t1-status-ping {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: ${accent};
      box-shadow: 0 0 12px ${accent};
      animation: t1-pulse 1.4s ease-in-out infinite;
    }

    @keyframes t1-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.6); opacity: 0.45; }
    }

    .t1-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 18px;
    }

    .t1-panel {
      border: 1px solid rgba(255,255,255,0.08);
      background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
      backdrop-filter: blur(12px);
    }

    .t1-main {
      min-width: 0;
      overflow: hidden;
    }

    .t1-sidebar {
      position: sticky;
      top: 24px;
      align-self: start;
      padding: 18px;
    }

    .t1-hero {
      padding: 22px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }

    .t1-console-line {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 11px;
      line-height: 1.7;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
      color: rgba(255,255,255,0.44);
    }

    .t1-console-prompt { color: ${accent}; }
    .t1-console-cursor {
      display: inline-block;
      width: 8px;
      height: 1em;
      background: ${accent};
      vertical-align: -2px;
      animation: t1-blink 1s step-end infinite;
    }

    @keyframes t1-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .t1-identity {
      display: grid;
      grid-template-columns: 88px minmax(0, 1fr);
      gap: 18px;
      align-items: start;
    }

    .t1-avatar {
      width: 88px;
      height: 88px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid ${accent}50;
      background: #0f0f0f;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
    }

    .t1-avatar-fallback {
      font-size: 26px;
      font-weight: 700;
      color: ${accent};
      font-family: ${font};
    }

    .t1-name {
      margin: 0 0 8px;
      font-size: clamp(28px, 4vw, 54px);
      line-height: 0.95;
      letter-spacing: -0.04em;
      font-weight: 800;
      color: #ffffff;
      font-family: ${FONT_MAP.display};
    }

    .t1-headline {
      margin: 0 0 14px;
      color: rgba(255,255,255,0.62);
      font-size: 14px;
      line-height: 1.7;
      max-width: 680px;
    }

    .t1-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 18px;
    }

    .t1-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 34px;
      padding: 0 12px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: rgba(255,255,255,0.7);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .t1-chip strong {
      color: ${accent};
      font-weight: 500;
    }

    .t1-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 2px;
    }

    .t1-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 42px;
      padding: 0 16px;
      text-decoration: none;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
      font-family: ${font};
    }

    .t1-btn:hover {
      transform: translateY(-1px);
    }

    .t1-btn-primary {
      background: ${accent};
      color: #050505;
      border: 1px solid ${accent};
      box-shadow: 0 0 22px ${accent}22;
    }

    .t1-btn-secondary {
      background: transparent;
      color: #e8e8e8;
      border: 1px solid rgba(255,255,255,0.12);
    }

    .t1-btn-secondary:hover {
      border-color: ${accent};
      color: ${accent};
    }

    .t1-grid {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 0;
    }

    .t1-section {
      padding: 22px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }

    .t1-section.right {
      border-left: 1px solid rgba(255,255,255,0.07);
    }

    .t1-section:last-child {
      border-bottom: none;
    }

    .t1-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: ${accent};
    }

    .t1-label::before {
      content: "";
      width: 10px;
      height: 10px;
      border: 1px solid ${accent};
      background: ${accent}22;
    }

    .t1-bio {
      margin: 0;
      font-size: 14px;
      line-height: 1.9;
      color: rgba(255,255,255,0.56);
      max-width: 720px;
    }

    .t1-service-list {
      display: grid;
      gap: 10px;
    }

    .t1-service {
      border: 1px solid rgba(255,255,255,0.07);
      background: #0c0c0c;
      padding: 14px;
      transition: border-color 180ms ease, transform 180ms ease;
    }

    .t1-service:hover {
      border-color: ${accent}66;
      transform: translateY(-1px);
    }

    .t1-service-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    .t1-service-title {
      margin: 0;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.5;
    }

    .t1-tag {
      flex-shrink: 0;
      border: 1px solid ${accent}40;
      color: ${accent};
      padding: 3px 7px;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .t1-service-description {
      margin: 0;
      color: rgba(255,255,255,0.4);
      font-size: 11px;
      line-height: 1.7;
    }

    .t1-projects {
      display: grid;
      gap: 12px;
    }

    .t1-project {
      display: grid;
      grid-template-columns: 180px minmax(0, 1fr);
      border: 1px solid rgba(255,255,255,0.07);
      background: #0b0b0b;
      overflow: hidden;
      transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
    }

    .t1-project:hover {
      transform: translateY(-2px);
      border-color: ${accent}66;
      box-shadow: 0 0 0 1px ${accent}22 inset;
    }

    .t1-project-visual {
      min-height: 148px;
      background:
        linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 100%),
        linear-gradient(135deg, ${accent}10 0%, transparent 100%),
        #0e0e0e;
      position: relative;
      overflow: hidden;
    }

    .t1-project-visual img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      opacity: 0.88;
    }

    .t1-project-index {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 2;
      background: rgba(5,5,5,0.82);
      border: 1px solid ${accent}55;
      color: ${accent};
      min-width: 38px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .t1-project-body {
      min-width: 0;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
    }

    .t1-project-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .t1-project-title {
      margin: 0;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .t1-project-status {
      flex-shrink: 0;
      color: ${accent};
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .t1-project-description {
      margin: 0;
      color: rgba(255,255,255,0.43);
      font-size: 12px;
      line-height: 1.7;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .t1-project-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .t1-inline-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.75);
      transition: color 180ms ease;
    }

    .t1-inline-link.primary {
      color: ${accent};
    }

    .t1-inline-link:hover {
      color: #fff;
    }

    .t1-card {
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      padding: 14px;
    }

    .t1-sidebar-title {
      margin: 0 0 14px;
      color: rgba(255,255,255,0.85);
      font-size: 12px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .t1-command-list {
      display: grid;
      gap: 10px;
    }

    .t1-command {
      border: 1px solid rgba(255,255,255,0.07);
      background: #0b0b0b;
      padding: 12px;
    }

    .t1-command-label {
      display: block;
      margin-bottom: 6px;
      color: ${accent};
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .t1-command-value {
      color: rgba(255,255,255,0.78);
      font-size: 12px;
      line-height: 1.6;
      word-break: break-word;
    }

    .t1-links {
      display: grid;
      gap: 8px;
    }

    .t1-social-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: 38px;
      padding: 0 12px;
      border: 1px solid rgba(255,255,255,0.07);
      background: #0b0b0b;
      text-decoration: none;
      color: rgba(255,255,255,0.72);
      transition: border-color 180ms ease, color 180ms ease, transform 180ms ease;
      font-size: 12px;
    }

    .t1-social-link:hover {
      color: ${accent};
      border-color: ${accent}55;
      transform: translateX(2px);
    }

    .t1-footer {
      margin-top: 18px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      padding: 14px 16px;
      font-size: 11px;
      color: rgba(255,255,255,0.46);
      line-height: 1.8;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .t1-footer a {
      color: ${accent};
      text-decoration: none;
    }

    @media (max-width: 1080px) {
      .t1-layout {
        grid-template-columns: 1fr;
      }

      .t1-sidebar {
        position: static;
      }
    }

    @media (max-width: 900px) {
      .t1-grid {
        grid-template-columns: 1fr;
      }

      .t1-section.right {
        border-left: none;
        border-top: 1px solid rgba(255,255,255,0.07);
      }

      .t1-project {
        grid-template-columns: 1fr;
      }

      .t1-project-visual {
        min-height: 180px;
      }
    }

    @media (max-width: 640px) {
      .t1-shell {
        padding: 16px 12px 28px;
      }

      .t1-topbar {
        padding: 10px 12px;
      }

      .t1-topbar-title {
        display: none;
      }

      .t1-hero,
      .t1-section,
      .t1-sidebar {
        padding: 16px;
      }

      .t1-identity {
        grid-template-columns: 1fr;
      }

      .t1-avatar {
        width: 74px;
        height: 74px;
      }

      .t1-name {
        font-size: 34px;
      }

      .t1-chip {
        width: 100%;
        justify-content: flex-start;
      }

      .t1-actions {
        flex-direction: column;
      }

      .t1-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  return (
    <div className="t1-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="t1-noise" />
      <div className="t1-scanline" />

      <div className="t1-shell">
        <div className="t1-topbar">
          <div className="t1-dots">
            <span className="t1-dot" />
            <span className="t1-dot accent" />
            <span className="t1-dot" />
            <span className="t1-topbar-title">developer-mode / template-01</span>
          </div>

          <div className="t1-status">
            <span className="t1-status-ping" />
            online
          </div>
        </div>

        <div className="t1-layout">
          <main className="t1-panel t1-main">
            <section className="t1-hero">
              <div className="t1-console-line">
                <span className="t1-console-prompt">$</span>
                <span>init portfolio --profile "{profile.username}"</span>
                <span className="t1-console-cursor" />
              </div>

              <div className="t1-identity">
                <div className="t1-avatar">
                  {profile.avatar_url ? (
                    <img
                      src={getAvatarUrl(profile.avatar_url) ?? ""}
                      alt={name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="t1-avatar-fallback">{initials}</div>
                  )}
                </div>

                <div>
                  <h1 className="t1-name">{name}</h1>

                  {profile.headline && (
                    <p className="t1-headline">{profile.headline}</p>
                  )}

                  <div className="t1-meta">
                    <div className="t1-chip">
                      <strong>mode</strong> developer
                    </div>

                    {profile.location && (
                      <div className="t1-chip">
                        <MapPin size={13} />
                        {profile.location}
                      </div>
                    )}

                    <div className="t1-chip">
                      <strong>projects</strong> {projects.length}
                    </div>

                    <div className="t1-chip">
                      <strong>services</strong> {services.length}
                    </div>
                  </div>

                  <div className="t1-actions">
                    {profile.whatsapp && (
                      <a
                        href={getWhatsAppUrl(
                          profile.whatsapp,
                          profile.full_name ?? undefined
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("whatsapp_click")}
                        className="t1-btn t1-btn-primary"
                      >
                        <MessageCircle size={14} />
                        Open WhatsApp
                      </a>
                    )}

                    {profile.email_contact && (
                      <a
                        href={`mailto:${profile.email_contact}`}
                        onClick={() => track("email_click")}
                        className="t1-btn t1-btn-secondary"
                      >
                        <Mail size={14} />
                        Send Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="t1-grid">
              <section className="t1-section">
                {profile.bio && (
                  <>
                    <div className="t1-label">about</div>
                    <p className="t1-bio">{profile.bio}</p>
                  </>
                )}

                {featuredProjects.length > 0 && (
                  <div style={{ marginTop: profile.bio ? 28 : 0 }}>
                    <div className="t1-label">builds / selected work</div>

                    <div className="t1-projects">
                      {featuredProjects.map((project, index) => (
                        <article key={project.id} className="t1-project">
                          <div className="t1-project-visual">
                            <div className="t1-project-index">
                              {formatIndex(index)}
                            </div>

                            {project.image_url && (
                              <img
                                src={getProjectImageUrl(project.image_url) ?? ""}
                                alt={project.title}
                              />
                            )}
                          </div>

                          <div className="t1-project-body">
                            <div>
                              <div className="t1-project-title-row">
                                <h3 className="t1-project-title">{project.title}</h3>
                                <span className="t1-project-status">deployed</span>
                              </div>

                              {project.description && (
                                <p className="t1-project-description">
                                  {project.description}
                                </p>
                              )}
                            </div>

                            <div className="t1-project-links">
                              {project.live_url && (
                                <a
                                  href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => track("live_url_click")}
                                  className="t1-inline-link primary"
                                >
                                  <ExternalLink size={13} />
                                  Live Preview
                                </a>
                              )}

                              {project.github_url && (
                                <a
                                  href={project.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => track("github_click")}
                                  className="t1-inline-link"
                                >
                                  <Github size={13} />
                                  Source Code
                                </a>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="t1-section right">
                {availableServices.length > 0 && (
                  <>
                    <div className="t1-label">services / commands</div>

                    <div className="t1-service-list">
                      {availableServices.map((service) => (
                        <article key={service.id} className="t1-service">
                          <div className="t1-service-top">
                            <h3 className="t1-service-title">{service.title}</h3>
                            {service.price && (
                              <span className="t1-tag">{service.price}</span>
                            )}
                          </div>

                          {service.description && (
                            <p className="t1-service-description">
                              {service.description}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  </>
                )}
              </section>
            </div>
          </main>

          <aside className="t1-panel t1-sidebar">
            <section className="t1-card" style={{ marginBottom: 14 }}>
              <h2 className="t1-sidebar-title">system info</h2>

              <div className="t1-command-list">
                <div className="t1-command">
                  <span className="t1-command-label">user</span>
                  <div className="t1-command-value">{name}</div>
                </div>

                <div className="t1-command">
                  <span className="t1-command-label">username</span>
                  <div className="t1-command-value">@{profile.username}</div>
                </div>

                {profile.email_contact && (
                  <div className="t1-command">
                    <span className="t1-command-label">email</span>
                    <div className="t1-command-value">{profile.email_contact}</div>
                  </div>
                )}

                {profile.whatsapp && (
                  <div className="t1-command">
                    <span className="t1-command-label">whatsapp</span>
                    <div className="t1-command-value">{profile.whatsapp}</div>
                  </div>
                )}
              </div>
            </section>

            <section className="t1-card" style={{ marginBottom: 14 }}>
              <h2 className="t1-sidebar-title">links</h2>

              <div className="t1-links">
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("github_click")}
                    className="t1-social-link"
                  >
                    <Github size={15} />
                    GitHub
                  </a>
                )}

                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t1-social-link"
                  >
                    <FaLinkedin size={15} />
                    LinkedIn
                  </a>
                )}

                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t1-social-link"
                  >
                    <FaTwitter size={15} />
                    Twitter / X
                  </a>
                )}

                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t1-social-link"
                  >
                    <FaInstagram size={15} />
                    Instagram
                  </a>
                )}

                {social.tiktok && (
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t1-social-link"
                  >
                    <FaTiktok size={15} />
                    TikTok
                  </a>
                )}

                {extraLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t1-social-link"
                    title={link.label}
                  >
                    <LinkIcon size={15} />
                    {link.label}
                  </a>
                ))}
              </div>
            </section>

            <section className="t1-card">
              <h2 className="t1-sidebar-title">contact</h2>

              <div className="t1-actions" style={{ marginTop: 0 }}>
                {profile.whatsapp && (
                  <a
                    href={getWhatsAppUrl(
                      profile.whatsapp,
                      profile.full_name ?? undefined
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("whatsapp_click")}
                    className="t1-btn t1-btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <MessageCircle size={14} />
                    Start Chat
                  </a>
                )}

                {profile.email_contact && (
                  <a
                    href={`mailto:${profile.email_contact}`}
                    onClick={() => track("email_click")}
                    className="t1-btn t1-btn-secondary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Mail size={14} />
                    Email Me
                  </a>
                )}
              </div>
            </section>
          </aside>
        </div>

        {profile.plan === "free" && (
          <div className="t1-footer">
            powered by <a href="/">{APP_NAME}</a>
          </div>
        )}
      </div>
    </div>
  );
}