# FolioHub

A personal landing page builder that helps people get jobs, clients, and leads.

## Tech Stack

- **Next.js 15** (App Router) — frontend + backend
- **TypeScript** — type safety throughout
- **Tailwind CSS** — styling
- **Supabase** — auth, database, storage
- **Stripe** — payments (free vs pro)
- **Resend** — transactional email
- **Vercel** — hosting

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo>
cd foliohub
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
3. Copy your project URL and keys from **Project Settings → API**

### 3. Set up Stripe

1. Create a product in Stripe Dashboard: **Products → Add product**
   - Name: "FolioHub Pro"
   - Price: ₦5000/month, recurring
2. Copy the **Price ID** (starts with `price_...`)
3. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy the **Webhook Signing Secret**

### 4. Set up Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain
3. Copy your API key

### 5. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FolioHub

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@yourdomain.com

STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_PRO_PRICE_ID=price_...
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

For Stripe webhooks locally, install the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.

Update `NEXT_PUBLIC_APP_URL` to your production domain.

## Project Structure

```
app/
  (auth)/          # Login, signup pages
  (dashboard)/     # Protected dashboard routes
  [username]/      # Public profile pages
  api/             # API routes (analytics, Stripe)
components/
  dashboard/       # Dashboard UI components
  public/
    templates/     # Template1, Template2, Template3
  ui/              # Base UI components
lib/
  supabase/        # Browser + server clients
  emails/          # Resend email templates
  stripe.ts        # Stripe helpers
  utils.ts         # Utility functions
types/             # TypeScript types
supabase/
  schema.sql       # Full database schema + RLS
```

## Features

### Free plan
- Public profile page at `username.foliohub.co`
- Up to 6 projects
- WhatsApp & email contact buttons
- Template 1 (Developer layout)
- FolioHub branding in footer

### Pro plan (₦5000/month)
- All 3 templates
- Analytics dashboard (views, clicks, conversion rate)
- No FolioHub branding
- Manage billing via Stripe portal

## Templates

1. **Developer** — Dark background, terminal aesthetic, project grid
2. **Freelancer** — Bold yellow/black, service-focused, strong CTAs
3. **Minimal CV** — Clean white, typography-first, elegant

## Adding new templates

1. Create `components/public/templates/template4.tsx`
2. Add to the templates map in `app/[username]/page.tsx`
3. Add template option in `components/dashboard/settings-client.tsx`
4. Update `template_id` check constraint in Supabase

## Customising the app name

Change `NEXT_PUBLIC_APP_NAME` in your `.env.local`. All email copy, footer branding, and metadata will update automatically.
