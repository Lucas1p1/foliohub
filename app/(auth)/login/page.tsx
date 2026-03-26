"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { signIn } from "../actions";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#111",
  border: "1px solid #2a2a2a",
  borderRadius: 4,
  padding: "11px 14px",
  fontSize: 13,
  color: "#e8e8e8",
  fontFamily: "'DM Mono', monospace",
  outline: "none",
  transition: "border-color 150ms",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: "#555",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  marginBottom: 8,
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
    <div style={{ width: "100%", maxWidth: 380 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 32, color: "#fff", fontWeight: 400, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 12, color: "#555", margin: 0 }}>Sign in to your dashboard</p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 4, padding: "12px 14px", fontSize: 12, color: "#f87171", marginBottom: 24 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            style={{ ...inputStyle, borderColor: focus === "email" ? "#e8ff47" : "#2a2a2a" }}
            onFocus={() => setFocus("email")}
            onBlur={() => setFocus(null)}
          />
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <input
            name="password"
            type="password"
            required
            style={{ ...inputStyle, borderColor: focus === "password" ? "#e8ff47" : "#2a2a2a" }}
            onFocus={() => setFocus("password")}
            onBlur={() => setFocus(null)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", background: "#e8ff47", color: "#0a0a0a", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 500, fontFamily: "'DM Mono', monospace", letterSpacing: "0.02em", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 150ms", marginTop: 4 }}
        >
          {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : null}
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={14} />}
        </button>
      </form>

      <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #1c1c1c", fontSize: 12, color: "#555" }}>
        No account?{" "}
        <Link href="/signup" style={{ color: "#888", textDecoration: "none", borderBottom: "1px solid #3a3a3a", paddingBottom: 1, transition: "color 150ms, border-color 150ms" }}>
          Create one free →
        </Link>
      </div>
    </div>
  );
}