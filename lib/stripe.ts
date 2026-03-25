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
  customers: {
    create: (params: Stripe.CustomerCreateParams, options?: Stripe.RequestOptions) =>
      getStripe().customers.create(params, options),
  },
  checkout: {
    sessions: {
      create: (params: Stripe.Checkout.SessionCreateParams, options?: Stripe.RequestOptions) =>
        getStripe().checkout.sessions.create(params, options),
    },
  },
  billingPortal: {
    sessions: {
      create: (params: Stripe.BillingPortal.SessionCreateParams, options?: Stripe.RequestOptions) =>
        getStripe().billingPortal.sessions.create(params, options),
    },
  },
  webhooks: {
    constructEvent: (
      payload: string | Buffer,
      header: string | Buffer | string[],
      secret: string,
      tolerance?: number,
      cryptoProvider?: Stripe.CryptoProvider
    ) => getStripe().webhooks.constructEvent(payload, header, secret, tolerance, cryptoProvider),
  },
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
