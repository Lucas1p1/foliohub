import Link from "next/link";
import { ArrowRight, BarChart2, Globe, MessageCircle, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="font-semibold text-lg">{APP_NAME}</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get started free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <Zap className="h-3.5 w-3.5" />
          Set up in under 5 minutes
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-[1.05]">
          Your personal page<br />
          <span className="text-muted-foreground">that gets you hired</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Fill in your info, pick a template, and publish a professional
          landing page that converts visitors into clients and employers.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">
              Create your page <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/demo">See an example</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">Free forever · No credit card needed</p>
      </section>

      {/* Social proof */}
      <section className="border-y border-border/50 py-12 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by developers, designers &amp; freelancers</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center opacity-40">
            {["React Dev", "UI Designer", "Freelancer", "Consultant", "Engineer", "Creator"].map((r) => (
              <div key={r} className="text-center text-xs font-medium">{r}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">
          Everything you need to get opportunities
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          No design skills needed. Fill a form and get a professional page that works.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: "Your own URL",
              desc: "Share yourusername.foliohub.co with anyone. Clean, professional, memorable.",
            },
            {
              icon: MessageCircle,
              title: "One-tap WhatsApp",
              desc: "Visitors click a button and land directly in your WhatsApp chat. Zero friction hiring.",
            },
            {
              icon: Palette,
              title: "3 beautiful templates",
              desc: "Developer, freelancer, and minimal CV styles. Switch any time with one click.",
            },
            {
              icon: BarChart2,
              title: "Built-in analytics",
              desc: "See how many people viewed your page, clicked WhatsApp, or emailed you.",
            },
            {
              icon: Zap,
              title: "Instant publishing",
              desc: "Toggle live/draft from your dashboard. Changes go live in seconds.",
            },
            {
              icon: ArrowRight,
              title: "Projects & services",
              desc: "Showcase your best work and list exactly what you offer with optional pricing.",
            },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 border-y border-border/50 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">
            Ready in 3 steps
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Fill your info", desc: "Add your name, headline, bio, projects, and WhatsApp number." },
              { step: "02", title: "Pick a template", desc: "Choose from 3 professional layouts that match your style." },
              { step: "03", title: "Publish & share", desc: "Hit publish, copy your link, and start getting opportunities." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-5xl font-bold text-border mb-4">{s.step}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">Simple pricing</h2>
        <p className="text-muted-foreground text-center mb-16">Start free. Upgrade when you're ready.</p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="rounded-xl border bg-card p-8">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-1">Free</h3>
              <div className="text-4xl font-bold mb-2">$0</div>
              <p className="text-sm text-muted-foreground">Forever free</p>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              {["Public profile page", "Up to 6 projects", "WhatsApp button", "1 template", "FolioHub branding"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
          {/* Pro */}
          <div className="rounded-xl border-2 border-foreground bg-card p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-foreground text-background text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-1">Pro</h3>
              <div className="text-4xl font-bold mb-2">$7<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <p className="text-sm text-muted-foreground">Cancel anytime</p>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              {["Everything in Free", "All 3 templates", "Analytics dashboard", "No FolioHub branding", "Priority support"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Button className="w-full" asChild>
              <Link href="/signup?plan=pro">Get Pro</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Your next opportunity starts with a link
          </h2>
          <p className="text-background/70 mb-8 text-lg">
            Create your page in minutes and start sharing it everywhere.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">
              Create your free page <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>{APP_NAME} © {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
