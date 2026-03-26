import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", fontFamily: "'DM Mono', monospace" }}>
      <nav style={{ height: 56, display: "flex", alignItems: "center", padding: "0 32px", borderBottom: "1px solid #1c1c1c" }}>
        <Link href="/" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, color: "#fff", textDecoration: "none", letterSpacing: "-0.02em" }}>
          {APP_NAME}
        </Link>
      </nav>
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {children}
      </main>
    </div>
  );
}