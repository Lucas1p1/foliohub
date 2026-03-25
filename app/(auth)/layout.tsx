import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <nav className="h-16 flex items-center px-6">
        <Link href="/" className="font-semibold text-lg">
          {APP_NAME}
        </Link>
      </nav>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
