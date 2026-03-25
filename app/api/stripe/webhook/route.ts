import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { sendProUpgradeEmail } from "@/lib/emails";
import type Stripe from "stripe";

// Use service role for webhook (bypasses RLS)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = getServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (!userId) break;

      await supabase.from("profiles").update({
        plan: "pro",
        stripe_subscription_id: session.subscription as string,
      }).eq("id", userId);

      // Send upgrade email
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, email_contact")
        .eq("id", userId)
        .single();
      if (profile?.email_contact && profile?.username) {
        await sendProUpgradeEmail(profile.email_contact, profile.username).catch(() => {});
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id;
      if (!userId) break;
      await supabase.from("profiles").update({
        plan: "free",
        stripe_subscription_id: null,
        template_id: 1, // Reset to free template
      }).eq("id", userId);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      await supabase.from("profiles").update({ plan: "free" })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
