import Link from "next/link";
import { Button } from "@/components/ui/button";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Introhub";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground/20 mb-4">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-xs">
        This profile doesn&apos;t exist or hasn&apos;t been published yet.
      </p>
      <Button asChild>
        <Link href="/">Create your own page on {APP_NAME}</Link>
      </Button>
    </div>
  );
}
