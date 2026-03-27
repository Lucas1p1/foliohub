import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BarChart2, Globe, MessageCircle, Layers, Zap } from "lucide-react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

const styles = `
  /* ─── hover states ─── */
  .fh-feature-card { background: #0a0a0a; transition: background 200ms; }
  .fh-feature-card:hover { background: #111111; }
  .fh-nav-link:hover { color: #d8d8d8 !important; }
  .fh-footer-link:hover { color: #666 !important; }

  /* ─── prevent horizontal scroll ─── */
  *, *::before, *::after { box-sizing: border-box; }
  html, body { overflow-x: hidden; max-width: 100%; }

  /* ─── mobile overrides ─── */
  @media (max-width: 768px) {
    .lp-nav-inner   { padding: 0 16px !important; }
    .lp-section     { padding: 56px 16px !important; }
    .lp-hero        { padding: 64px 16px 52px !important; }
    .lp-cta-section { padding: 64px 16px !important; }
    .lp-footer      { padding: 24px 16px !important; }

    .lp-hero-h1     { font-size: clamp(38px, 10vw, 64px) !important; }
    .lp-hero-sub    { font-size: 15px !important; }

    .lp-cta-row     { flex-direction: column !important; align-items: stretch !important; }
    .lp-cta-row a   { text-align: center; justify-content: center; }

    .lp-features-grid { grid-template-columns: 1fr !important; }
    .lp-steps-grid    { grid-template-columns: 1fr !important; gap: 32px !important; }
    .lp-pricing-grid  { grid-template-columns: 1fr !important; max-width: 100% !important; }

    .lp-badge-row   { display: none !important; }

    /* hide nav sign-in on very small screens — just show the CTA */
    .lp-nav-signin  { display: none !important; }
  }
`;

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#d8d8d8", fontFamily: "'DM Sans', -apple-system, sans-serif", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ── Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,5,5,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: 60,
        display: "flex", alignItems: "center",
      }}>
        <div className="lp-nav-inner" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Image src="/logo1.png" alt="" width={26} height={26} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#fff", letterSpacing: "-0.03em", fontStyle: "italic" }}>
              {APP_NAME}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link href="/login" className="lp-nav-signin fh-nav-link" style={{ padding: "8px 18px", fontSize: 13, color: "#666", textDecoration: "none", letterSpacing: "0.01em", fontWeight: 300, transition: "color 150ms", borderRadius: 6 }}>
              Sign in
            </Link>
            <Link href="/signup" style={{
              padding: "8px 20px", fontSize: 13,
              background: "#fff", color: "#050505",
              textDecoration: "none", fontWeight: 500,
              borderRadius: 6, letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero" style={{ maxWidth: 1120, margin: "0 auto", padding: "110px 40px 90px" }}>
        {/* Pill badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, marginBottom: 44, fontSize: 11, color: "#666", letterSpacing: "0.1em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px rgba(74,222,128,0.5)" }} />
          FREE TO START
        </div>

        {/* Headline */}
        <div style={{ maxWidth: 760, marginBottom: 28 }}>
          <h1 className="lp-hero-h1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(48px, 7.5vw, 88px)", fontWeight: 400, lineHeight: 0.97, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 16px" }}>
            The page that<br />
            <em style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>lands you work.</em>
          </h1>
        </div>

        <p className="lp-hero-sub" style={{ fontSize: 16, color: "#555", lineHeight: 1.75, maxWidth: 380, margin: "0 0 44px", fontWeight: 300 }}>
          One link. Your projects, services, and contact — built to convert visitors into clients.
        </p>

        <div className="lp-cta-row" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 28px", background: "#fff", color: "#050505",
            textDecoration: "none", fontSize: 14, fontWeight: 500,
            letterSpacing: "0.01em", borderRadius: 8,
          }}>
            Create your page <ArrowUpRight size={14} />
          </Link>
          <Link href="/demo" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 24px", border: "1px solid rgba(255,255,255,0.1)",
            color: "#666", textDecoration: "none", fontSize: 14,
            letterSpacing: "0.01em", borderRadius: 8,
          }}>
            View example
          </Link>
        </div>

        <p style={{ marginTop: 24, fontSize: 11, color: "#2a2a2a", letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
          NO CREDIT CARD · FREE FOREVER
        </p>

        {/* Divider + social proof */}
        <div className="lp-badge-row" style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 80 }}>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06))" }} />
          <span style={{ fontSize: 10, color: "#2e2e2e", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
            BUILT FOR CREATORS WORLDWIDE
          </span>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.06))" }} />
        </div>
        <div className="lp-badge-row" style={{ display: "flex", gap: 36, marginTop: 28, flexWrap: "wrap" }}>
          {["Developers", "Designers", "Freelancers", "Consultants", "Creators"].map(r => (
            <span key={r} style={{ fontSize: 11, letterSpacing: "0.1em", color: "#2a2a2a", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
              {r.toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-section" style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 14 }}>EVERYTHING INCLUDED</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
            What you get
          </h2>
        </div>

        <div className="lp-features-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1px", background: "rgba(255,255,255,0.05)", borderRadius: 12,
          overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)",
        }}>
          {[
            { icon: Globe,         label: "Your own URL",        desc: "A link you're proud to put in your bio. Clean, simple, memorable." },
            { icon: MessageCircle, label: "One-tap WhatsApp",    desc: "Visitors land in your chat instantly. Zero friction between interest and conversation." },
            { icon: Layers,        label: "3 premium templates", desc: "Designed with intention. Each layout has its own distinct personality." },
            { icon: BarChart2,     label: "Real analytics",      desc: "Views, clicks, and conversion rate. Know what's working." },
            { icon: Zap,           label: "Instant publishing",  desc: "Toggle live/draft at any moment. No deploys, no waiting." },
            { icon: ArrowUpRight,  label: "Projects & services", desc: "Show your work. List what you offer. Let opportunities come to you." },
          ].map((f) => (
            <div key={f.label} className="fh-feature-card" style={{ padding: "28px 24px" }}>
              <f.icon size={15} style={{ color: "rgba(255,255,255,0.3)", marginBottom: 16 }} />
              <div style={{ fontSize: 14, color: "#e8e8e8", marginBottom: 6, fontWeight: 400, letterSpacing: "-0.01em" }}>{f.label}</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-section" style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 14 }}>THE PROCESS</div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", letterSpacing: "-0.03em", margin: "0 0 52px" }}>
          Up in minutes
        </h2>
        <div className="lp-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48 }}>
          {[
            { n: "01", t: "Fill your profile",  d: "Name, headline, bio, WhatsApp number, and your best projects. Simple form, five minutes." },
            { n: "02", t: "Pick your template", d: "Three distinct designs. Noir editorial, clean magazine, or structured minimal." },
            { n: "03", t: "Publish & share",    d: "Your link is live. Add it to your bio, email footer, CV — everywhere." },
          ].map(s => (
            <div key={s.n}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 56, color: "rgba(255,255,255,0.04)", lineHeight: 1, marginBottom: 18, userSelect: "none" }}>
                {s.n}
              </div>
              <div style={{ fontSize: 14, color: "#e8e8e8", marginBottom: 8, letterSpacing: "-0.01em" }}>{s.t}</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 1.75, fontWeight: 300 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="lp-section" style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 14 }}>PRICING</div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", letterSpacing: "-0.03em", margin: "0 0 44px" }}>
          Simple & transparent
        </h2>
        <div className="lp-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "rgba(255,255,255,0.05)", maxWidth: 640, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
          {/* Free */}
          <div style={{ background: "#0a0a0a", padding: "36px 28px" }}>
            <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 18 }}>FREE</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 48, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>₦0</div>
            <div style={{ fontSize: 12, color: "#333", marginBottom: 28, fontWeight: 300 }}>Forever free</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {["Public profile page", "Up to 6 projects", "WhatsApp button", "1 template", "Introhub footer"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "#555", fontWeight: 300 }}>
                  <span style={{ color: "#2e2e2e", flexShrink: 0 }}>—</span> {f}
                </div>
              ))}
            </div>
            <Link href="/signup" style={{ display: "block", textAlign: "center", padding: "11px 0", border: "1px solid rgba(255,255,255,0.08)", color: "#555", textDecoration: "none", fontSize: 13, borderRadius: 6 }}>
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div style={{ background: "#0d0d0d", padding: "36px 28px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 20, background: "#fff", color: "#050505", fontSize: 9, fontWeight: 600, padding: "4px 10px", letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif", borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}>
              POPULAR
            </div>
            <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 18 }}>PRO</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 48, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>₦5k</div>
            <div style={{ fontSize: 12, color: "#444", marginBottom: 28, fontWeight: 300 }}>per month</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {["Everything in Free", "All 3 templates", "Analytics", "No branding", "Multiple pages"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "#e8e8e8", fontWeight: 300 }}>
                  <span style={{ color: "#888", flexShrink: 0 }}>—</span> {f}
                </div>
              ))}
            </div>
            <Link href="/signup?plan=pro" style={{ display: "block", textAlign: "center", padding: "11px 0", background: "#fff", color: "#050505", textDecoration: "none", fontSize: 13, fontWeight: 500, borderRadius: 6 }}>
              Get Pro
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta-section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 6vw, 68px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.04em", margin: "0 0 16px", lineHeight: 1.05 }}>
          Your next opportunity<br />
          <em style={{ color: "rgba(255,255,255,0.3)" }}>starts with a link.</em>
        </h2>
        <p style={{ fontSize: 14, color: "#444", marginBottom: 40, fontWeight: 300 }}>Create your page in under five minutes.</p>
        <Link href="/signup" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "14px 34px", background: "#fff", color: "#050505",
          textDecoration: "none", fontSize: 14, fontWeight: 500,
          letterSpacing: "0.01em", borderRadius: 8,
        }}>
          Create your free page <ArrowUpRight size={14} />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 40px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>{APP_NAME}</span>
          <div style={{ display: "flex", gap: 24 }}>
            {[["Privacy", "/privacy"], ["Terms", "/terms"]].map(([label, href]) => (
              <Link key={href} href={href} className="fh-footer-link" style={{ fontSize: 12, color: "#2e2e2e", textDecoration: "none", letterSpacing: "0.04em", transition: "color 150ms", fontFamily: "'Syne', sans-serif" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}