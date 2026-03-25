import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  stripe,
  createStripeCustomer,
  createCheckoutSession,
  createBillingPortalSession,
} from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { userId, email, hasSubscription } = await request.json();
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("id", userId)
      .single();

    // Already subscribed → billing portal
    if (hasSubscription && profile?.stripe_customer_id) {
      const session = await createBillingPortalSession(profile.stripe_customer_id, APP_URL);
      return NextResponse.json({ url: session.url });
    }

    // Get or create Stripe customer
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await createStripeCustomer(email, userId);
      customerId = customer.id;
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId);
    }

    const session = await createCheckoutSession(customerId, userId, APP_URL);
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
