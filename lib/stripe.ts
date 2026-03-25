import Stripe from "stripe";

// Lazy instantiation — prevents build-time errors when env var isn't present
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "api_key_placeholder", {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Keep named export for convenience
export const stripe = {
  customers: { create: (...a: Parameters<Stripe["customers"]["create"]>) => getStripe().customers.create(...a) },
  checkout: { sessions: { create: (...a: Parameters<Stripe["checkout"]["sessions"]["create"]>) => getStripe().checkout.sessions.create(...a) } },
  billingPortal: { sessions: { create: (...a: Parameters<Stripe["billingPortal"]["sessions"]["create"]>) => getStripe().billingPortal.sessions.create(...a) } },
  webhooks: { constructEvent: (...a: Parameters<Stripe["webhooks"]["constructEvent"]>) => getStripe().webhooks.constructEvent(...a) },
};

export async function createStripeCustomer(email: string, userId: string) {
  return stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });
}

export async function createCheckoutSession(
  customerId: string,
  userId: string,
  returnUrl: string
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${returnUrl}/dashboard/settings?upgraded=true`,
    cancel_url: `${returnUrl}/dashboard/settings`,
    metadata: { user_id: userId },
    subscription_data: {
      metadata: { user_id: userId },
    },
  });
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${returnUrl}/dashboard/settings`,
  });
}
