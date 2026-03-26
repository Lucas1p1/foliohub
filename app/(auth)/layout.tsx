import Link from "next/link";
import Image from "next/image";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#050505",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}>
      <nav style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        import Image from "next/image";

// Replace the Link contents:
<Link href="/" style={{ textDecoration: "none" }}>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <Image src="/logo1.png" alt="" width={26} height={26} style={{ objectFit: "contain" }} />
    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#fff", letterSpacing: "-0.03em", fontStyle: "italic" }}>
      {APP_NAME}
    </span>
  </div>
</Link>
      </nav>
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {children}
      </main>
    </div>
  );
}