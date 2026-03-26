import Link from "next/link";
import Image from "next/image";

import { ArrowUpRight, BarChart2, Globe, MessageCircle, Layers, Zap } from "lucide-react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

// Injected once at the top of the page — avoids any client-side event handlers
const hoverStyles = `
  .fh-feature-card { background: #0a0a0a; transition: background 200ms; }
  .fh-feature-card:hover { background: #111111; }
  .fh-nav-link:hover { color: #d8d8d8 !important; }
  .fh-cta-outline:hover { border-color: rgba(255,255,255,0.2) !important; color: #aaa !important; }
  .fh-footer-link:hover { color: #666 !important; }
`;

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#d8d8d8", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: hoverStyles }} />

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,5,5,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: 60,
        display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <Image src="/logo1.png" alt="" width={26} height={26} style={{ objectFit: "contain" }} />
  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#fff", letterSpacing: "-0.03em", fontStyle: "italic" }}>
    {APP_NAME}
  </span>
</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link href="/login" className="fh-nav-link" style={{ padding: "8px 18px", fontSize: 13, color: "#666", textDecoration: "none", letterSpacing: "0.01em", fontWeight: 300, transition: "color 150ms", borderRadius: 6 }}>
              Sign in
            </Link>
            <Link href="/signup" style={{
              padding: "8px 20px", fontSize: 13,
              background: "#fff", color: "#050505",
              textDecoration: "none", fontWeight: 500,
              borderRadius: 6, letterSpacing: "0.01em",
              transition: "background 150ms, transform 100ms",
            }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "110px 40px 90px" }}>

        {/* Pill badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, marginBottom: 52, fontSize: 11, color: "#666", letterSpacing: "0.1em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px rgba(74,222,128,0.5)" }} />
          FREE TO START
        </div>

        {/* Headline */}
        <div style={{ maxWidth: 760, marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(52px, 7.5vw, 88px)", fontWeight: 400, lineHeight: 0.97, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 16px" }}>
            The page that<br />
            <em style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>lands you work.</em>
          </h1>
        </div>

        <p style={{ fontSize: 16, color: "#555", lineHeight: 1.75, maxWidth: 400, margin: "0 0 52px", fontWeight: 300 }}>
          One link. Your projects, services, and contact. Built to convert visitors into clients, jobs, and collaborators.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 28px", background: "#fff", color: "#050505",
            textDecoration: "none", fontSize: 14, fontWeight: 500,
            letterSpacing: "0.01em", borderRadius: 8, transition: "background 150ms",
          }}>
            Create your page <ArrowUpRight size={14} />
          </Link>
          <Link href="/demo" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 24px", border: "1px solid rgba(255,255,255,0.1)",
            color: "#666", textDecoration: "none", fontSize: 14,
            letterSpacing: "0.01em", borderRadius: 8, transition: "all 150ms",
          }}>
            View example
          </Link>
        </div>

        <p style={{ marginTop: 24, fontSize: 11, color: "#2a2a2a", letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
          NO CREDIT CARD · FREE FOREVER
        </p>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 96 }}>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06))" }} />
          <span style={{ fontSize: 10, color: "#2e2e2e", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
            BUILT FOR CREATORS WORLDWIDE
          </span>
          <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.06))" }} />
        </div>

        {/* Social proof */}
        <div style={{ display: "flex", gap: 36, marginTop: 32, flexWrap: "wrap" }}>
          {["Developers", "Designers", "Freelancers", "Consultants", "Creators"].map(r => (
            <span key={r} style={{ fontSize: 11, letterSpacing: "0.1em", color: "#2a2a2a", fontFamily: "'Syne', sans-serif", fontWeight: 500 }}>
              {r.toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 16 }}>EVERYTHING INCLUDED</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 4vw, 44px)", color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
            What you get
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1px", background: "rgba(255,255,255,0.05)", borderRadius: 12, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          {[
            { icon: Globe,         label: "Your own URL",        desc: "A link you're proud to put in your bio. Clean, simple, memorable." },
            { icon: MessageCircle, label: "One-tap WhatsApp",    desc: "Visitors land in your chat instantly. Zero friction between interest and conversation." },
            { icon: Layers,        label: "3 premium templates", desc: "Designed with intention. Each layout has its own distinct personality." },
            { icon: BarChart2,     label: "Real analytics",      desc: "Views, clicks, and conversion rate. Know what's working." },
            { icon: Zap,           label: "Instant publishing",  desc: "Toggle live/draft at any moment. No deploys, no waiting." },
            { icon: ArrowUpRight,  label: "Projects & services", desc: "Show your work. List what you offer. Let opportunities come to you." },
          ].map((f) => (
            <div key={f.label} className="fh-feature-card" style={{ padding: "32px 28px" }}>
              <f.icon size={15} style={{ color: "rgba(255,255,255,0.3)", marginBottom: 18 }} />
              <div style={{ fontSize: 14, color: "#e8e8e8", marginBottom: 8, fontWeight: 400, letterSpacing: "-0.01em" }}>{f.label}</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 16 }}>THE PROCESS</div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 4vw, 44px)", color: "#fff", letterSpacing: "-0.03em", margin: "0 0 64px" }}>
          Up in minutes
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 48 }}>
          {[
            { n: "01", t: "Fill your profile",  d: "Name, headline, bio, WhatsApp number, and your best projects. Simple form, five minutes." },
            { n: "02", t: "Pick your template", d: "Three distinct designs. Noir editorial, clean magazine, or structured minimal." },
            { n: "03", t: "Publish & share",    d: "Your link is live. Add it to your bio, email footer, CV — everywhere." },
          ].map(s => (
            <div key={s.n}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 64, color: "rgba(255,255,255,0.04)", lineHeight: 1, marginBottom: 20, userSelect: "none", fontWeight: 400 }}>
                {s.n}
              </div>
              <div style={{ fontSize: 14, color: "#e8e8e8", marginBottom: 8, letterSpacing: "-0.01em" }}>{s.t}</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 1.75, fontWeight: 300 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 16 }}>PRICING</div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 4vw, 44px)", color: "#fff", letterSpacing: "-0.03em", margin: "0 0 52px" }}>
          Simple & transparent
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "rgba(255,255,255,0.05)", maxWidth: 640, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
          {/* Free */}
          <div style={{ background: "#0a0a0a", padding: "40px 36px" }}>
            <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 20 }}>FREE</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>₦0</div>
            <div style={{ fontSize: 12, color: "#333", marginBottom: 36, fontWeight: 300 }}>Forever free</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 36 }}>
              {["Public profile page", "Up to 6 projects", "WhatsApp button", "1 template", "FolioHub footer"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "#555", fontWeight: 300 }}>
                  <span style={{ color: "#2e2e2e" }}>—</span> {f}
                </div>
              ))}
            </div>
            <Link href="/signup" style={{
              display: "block", textAlign: "center", padding: "11px 0",
              border: "1px solid rgba(255,255,255,0.08)", color: "#555",
              textDecoration: "none", fontSize: 13, letterSpacing: "0.01em", borderRadius: 6, transition: "all 150ms",
            }}>
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div style={{ background: "#0d0d0d", padding: "40px 36px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 28, background: "#fff", color: "#050505", fontSize: 10, fontWeight: 600, padding: "4px 10px", letterSpacing: "0.08em", fontFamily: "'Syne', sans-serif", borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}>
              POPULAR
            </div>
            <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.12em", fontFamily: "'Syne', sans-serif", fontWeight: 500, marginBottom: 20 }}>PRO</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>₦5000</div>
            <div style={{ fontSize: 12, color: "#444", marginBottom: 36, fontWeight: 300 }}>per month · cancel anytime</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 36 }}>
              {["Everything in Free", "All 3 templates", "Analytics dashboard", "No FolioHub branding", "Multiple pages"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "#e8e8e8", fontWeight: 300 }}>
                  <span style={{ color: "#888" }}>—</span> {f}
                </div>
              ))}
            </div>
            <Link href="/signup?plan=pro" style={{
              display: "block", textAlign: "center", padding: "11px 0",
              background: "#fff", color: "#050505",
              textDecoration: "none", fontSize: 13, letterSpacing: "0.01em", fontWeight: 500, borderRadius: 6,
            }}>
              Get Pro
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.04em", margin: "0 0 18px", lineHeight: 1.0 }}>
          Your next opportunity<br />
          <em style={{ color: "rgba(255,255,255,0.3)" }}>starts with a link.</em>
        </h2>
        <p style={{ fontSize: 14, color: "#444", marginBottom: 44, fontWeight: 300 }}>Create your page in under five minutes.</p>
        <Link href="/signup" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "14px 34px", background: "#fff", color: "#050505",
          textDecoration: "none", fontSize: 14, fontWeight: 500,
          letterSpacing: "0.01em", borderRadius: 8,
        }}>
          Create your free page <ArrowUpRight size={14} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 40px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>{APP_NAME}</span>
          <div style={{ display: "flex", gap: 28 }}>
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