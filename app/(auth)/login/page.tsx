"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { signIn } from "../actions";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "12px 16px",
  fontSize: 14,
  color: "#e8e8e8",
  fontFamily: "'DM Sans', -apple-system, sans-serif",
  fontWeight: 300,
  outline: "none",
  transition: "border-color 150ms, background 150ms",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: "#444",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  marginBottom: 8,
  fontFamily: "'Syne', sans-serif",
  fontWeight: 500,
};

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await signIn(fd);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div style={{ marginBottom: 44 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 38, color: "#fff", fontWeight: 400, letterSpacing: "-0.035em", margin: "0 0 10px", lineHeight: 1 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: "#444", margin: 0, fontWeight: 300 }}>Sign in to your dashboard</p>
      </div>

      {error && (
        <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 28, fontWeight: 300 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            name="email" type="email" placeholder="you@example.com" required
            style={{ ...inputStyle, borderColor: focus === "email" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", background: focus === "email" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)" }}
            onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
          />
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <input
            name="password" type="password" required
            style={{ ...inputStyle, borderColor: focus === "password" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", background: focus === "password" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)" }}
            onFocus={() => setFocus("password")} onBlur={() => setFocus(null)}
          />
        </div>

        <button
          type="submit" disabled={loading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "13px 0",
            background: loading ? "rgba(255,255,255,0.85)" : "#fff",
            color: "#050505", border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 500,
            fontFamily: "'DM Sans', -apple-system, sans-serif",
            letterSpacing: "0.01em", cursor: loading ? "not-allowed" : "pointer",
            transition: "background 150ms", marginTop: 6,
          }}
        >
          {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : null}
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight size={14} />}
        </button>
      </form>

      <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 13, color: "#444", fontWeight: 300 }}>
        No account?{" "}
        <Link href="/signup" style={{ color: "#999", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 1 }}>
          Create one free →
        </Link>
      </div>
    </div>
  );
}