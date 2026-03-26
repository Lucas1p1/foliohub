import Link from "next/link";
import { ArrowUpRight, BarChart2, Globe, MessageCircle, Layers, Zap } from "lucide-react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", color: "#e8e8e8", fontFamily: "'DM Mono', monospace" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1c1c1c", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, color: "#fff", letterSpacing: "-0.02em" }}>
            {APP_NAME}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/login" style={{ padding: "7px 16px", fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: "0.04em", transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e8e8e8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
              Log in
            </Link>
            <Link href="/signup" style={{ padding: "7px 18px", fontSize: 12, background: "#e8ff47", color: "#0a0a0a", textDecoration: "none", letterSpacing: "0.04em", fontWeight: 500, borderRadius: 4, transition: "background 150ms" }}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 32px 100px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid #1c1c1c", borderRadius: 99, marginBottom: 40, fontSize: 11, color: "#888", letterSpacing: "0.06em" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8ff47", display: "inline-block" }} />
          SET UP IN UNDER 5 MINUTES
        </div>

        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, lineHeight: 0.95, letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 32px", maxWidth: 800 }}>
          Your page.<br />
          <em style={{ color: "#888888" }}>Your opportunities.</em>
        </h1>

        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.8, maxWidth: 420, margin: "0 0 48px", letterSpacing: "0.01em" }}>
          One link. Your work, services, and contact — all in a single page that converts visitors into clients, employers, and collaborators.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "#e8ff47", color: "#0a0a0a", textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.02em", borderRadius: 4, transition: "background 150ms" }}>
            Create your page <ArrowUpRight size={14} />
          </Link>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", border: "1px solid #2a2a2a", color: "#888", textDecoration: "none", fontSize: 13, letterSpacing: "0.02em", borderRadius: 4, transition: "all 150ms" }}>
            See an example
          </Link>
        </div>

        <p style={{ marginTop: 20, fontSize: 11, color: "#3a3a3a", letterSpacing: "0.06em" }}>FREE FOREVER · NO CREDIT CARD</p>

        {/* Horizontal rule with ornament */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 100 }}>
          <div style={{ height: 1, flex: 1, background: "#1c1c1c" }} />
          <span style={{ fontSize: 11, color: "#3a3a3a", letterSpacing: "0.1em" }}>TRUSTED BY MAKERS WORLDWIDE</span>
          <div style={{ height: 1, flex: 1, background: "#1c1c1c" }} />
        </div>

        {/* Social proof strip */}
        <div style={{ display: "flex", gap: 40, marginTop: 32, opacity: 0.3, flexWrap: "wrap" }}>
          {["React Dev", "UI Designer", "Freelancer", "Consultant", "Engineer", "Creator"].map(r => (
            <span key={r} style={{ fontSize: 11, letterSpacing: "0.1em", color: "#888" }}>{r.toUpperCase()}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 56 }}>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, color: "#fff", letterSpacing: "-0.02em" }}>
            Everything you need
          </span>
          <span style={{ fontSize: 11, color: "#3a3a3a", letterSpacing: "0.1em" }}>06 FEATURES</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 1, background: "#1c1c1c", border: "1px solid #1c1c1c", borderRadius: 8, overflow: "hidden" }}>
          {[
            { icon: Globe,          label: "Your own URL",         desc: "A clean link you're proud to share. yourusername.foliohub.co — nothing more." },
            { icon: MessageCircle,  label: "One-tap WhatsApp",     desc: "Visitors land directly in your WhatsApp chat. Zero friction between interest and conversation." },
            { icon: Layers,         label: "3 premium templates",  desc: "Noir, Editorial, Atelier. Each crafted to feel genuinely designed, not generated." },
            { icon: BarChart2,      label: "Real analytics",       desc: "Views, WhatsApp clicks, conversion rate. Know exactly what's working." },
            { icon: Zap,            label: "Instant publishing",   desc: "Toggle live/draft. Changes appear in seconds, no deploys, no friction." },
            { icon: ArrowUpRight,   label: "Projects & services",  desc: "Show your best work. List what you offer. Name your price." },
          ].map((f, i) => (
            <div key={f.label} style={{ background: "#0a0a0a", padding: "32px 28px", transition: "background 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#111")}
              onMouseLeave={e => (e.currentTarget.style.background = "#0a0a0a")}>
              <f.icon size={16} style={{ color: "#e8ff47", marginBottom: 20 }} />
              <div style={{ fontSize: 13, color: "#e8e8e8", marginBottom: 8, letterSpacing: "0.01em" }}>{f.label}</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px", borderTop: "1px solid #1c1c1c" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 64 }}>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, color: "#fff", letterSpacing: "-0.02em" }}>
            Three steps
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 48 }}>
          {[
            { n: "01", t: "Fill your info", d: "Name, headline, bio, WhatsApp, projects. It takes minutes." },
            { n: "02", t: "Pick a template", d: "Three distinct aesthetics. Developer, editorial, or minimal." },
            { n: "03", t: "Publish & share", d: "Your link is live. Put it in your bio, email signature, everywhere." },
          ].map(s => (
            <div key={s.n}>
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 72, color: "#1c1c1c", lineHeight: 1, marginBottom: 20, userSelect: "none" }}>{s.n}</div>
              <div style={{ fontSize: 14, color: "#e8e8e8", marginBottom: 8 }}>{s.t}</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.8 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px", borderTop: "1px solid #1c1c1c" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 56 }}>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, color: "#fff", letterSpacing: "-0.02em" }}>
            Simple pricing
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "#1c1c1c", maxWidth: 640, border: "1px solid #1c1c1c", borderRadius: 8, overflow: "hidden" }}>
          {/* Free */}
          <div style={{ background: "#0a0a0a", padding: "36px 32px" }}>
            <div style={{ fontSize: 11, color: "#3a3a3a", letterSpacing: "0.1em", marginBottom: 16 }}>FREE</div>
            <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 48, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>$0</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 32 }}>Forever free</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {["Public profile page", "Up to 6 projects", "WhatsApp button", "1 template", "FolioHub branding"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, fontSize: 12, color: "#666" }}>
                  <span style={{ color: "#3a3a3a" }}>—</span> {f}
                </div>
              ))}
            </div>
            <Link href="/signup" style={{ display: "block", textAlign: "center", padding: "11px 0", border: "1px solid #2a2a2a", color: "#666", textDecoration: "none", fontSize: 12, letterSpacing: "0.04em", borderRadius: 4, transition: "all 150ms" }}>
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div style={{ background: "#0d0d0d", padding: "36px 32px", position: "relative" }}>
            <div style={{ position: "absolute", top: -1, left: 24, background: "#e8ff47", color: "#0a0a0a", fontSize: 10, fontWeight: 500, padding: "4px 10px", letterSpacing: "0.06em" }}>
              MOST POPULAR
            </div>
            <div style={{ fontSize: 11, color: "#e8ff47", letterSpacing: "0.1em", marginBottom: 16 }}>PRO</div>
            <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 48, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>$7</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 32 }}>per month · cancel anytime</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {["Everything in Free", "All 3 templates", "Analytics dashboard", "No FolioHub branding", "Multiple pages (Pro)"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, fontSize: 12, color: "#e8e8e8" }}>
                  <span style={{ color: "#e8ff47" }}>—</span> {f}
                </div>
              ))}
            </div>
            <Link href="/signup?plan=pro" style={{ display: "block", textAlign: "center", padding: "11px 0", background: "#e8ff47", color: "#0a0a0a", textDecoration: "none", fontSize: 12, letterSpacing: "0.04em", fontWeight: 500, borderRadius: 4 }}>
              Get Pro
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid #1c1c1c", padding: "100px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 20px" }}>
          Your next opportunity<br /><em style={{ color: "#888" }}>starts with a link</em>
        </h2>
        <p style={{ fontSize: 13, color: "#555", marginBottom: 40 }}>Create your page in minutes.</p>
        <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", background: "#e8ff47", color: "#0a0a0a", textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.02em", borderRadius: 4 }}>
          Create your free page <ArrowUpRight size={14} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1c1c1c", padding: "28px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 11, color: "#3a3a3a", letterSpacing: "0.06em" }}>{APP_NAME} © {new Date().getFullYear()}</span>
          <div style={{ display: "flex", gap: 24 }}>
            {[["Privacy", "/privacy"], ["Terms", "/terms"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: 11, color: "#3a3a3a", textDecoration: "none", letterSpacing: "0.06em", transition: "color 150ms" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#888")}
                onMouseLeave={e => (e.currentTarget.style.color = "#3a3a3a")}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}