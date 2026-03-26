import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifyWebhookSignature } from "@/lib/paystack";
import { sendProUpgradeEmail } from "@/lib/emails";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("x-paystack-signature") ?? "";

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as { event: string; data: Record<string, unknown> };
  const supabase = getServiceClient();

  switch (event.event) {
    // Subscription successfully created (first charge)
    case "subscription.create":
    case "charge.success": {
      const data = event.data;
      const metadata = (data.metadata ?? {}) as Record<string, string>;
      const userId = metadata.user_id;
      if (!userId) break;

      const subscriptionCode =
        (data.subscription_code as string) ??
        ((data.subscription as Record<string, string>)?.subscription_code);
      const emailToken =
        (data.email_token as string) ??
        ((data.subscription as Record<string, string>)?.email_token);

      await supabase
        .from("profiles")
        .update({
          plan: "pro",
          paystack_subscription_code: subscriptionCode ?? null,
          paystack_email_token: emailToken ?? null,
        })
        .eq("id", userId);

      // Send upgrade email (only on first charge)
      if (event.event === "charge.success") {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, email_contact")
            .eq("id", userId)
            .single();
          if (profile?.email_contact && profile?.username) {
            await sendProUpgradeEmail(profile.email_contact, profile.username);
          }
        } catch {
          // Non-fatal
        }
      }
      break;
    }

    // Subscription cancelled / disabled
    case "subscription.disable":
    case "subscription.not_renew": {
      const data = event.data as { subscription_code?: string };
      const subscriptionCode = data.subscription_code;
      if (!subscriptionCode) break;

      await supabase
        .from("profiles")
        .update({
          plan: "free",
          paystack_subscription_code: null,
          paystack_email_token: null,
          template_id: 1,
        })
        .eq("paystack_subscription_code", subscriptionCode);
      break;
    }

    // Payment failed — downgrade
    case "invoice.payment_failed": {
      const data = event.data as { subscription?: { subscription_code?: string } };
      const subscriptionCode = data.subscription?.subscription_code;
      if (!subscriptionCode) break;

      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("paystack_subscription_code", subscriptionCode);
      break;
    }
  }

  return NextResponse.json({ received: true });
}