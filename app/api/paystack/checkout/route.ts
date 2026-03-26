import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initializeSubscription, disableSubscription, fetchSubscription } from "@/lib/paystack";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function POST(request: Request) {
  try {
    const { userId, email, action } = await request.json();

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("paystack_subscription_code, paystack_email_token, plan")
      .eq("id", userId)
      .single();

    // --- Cancel / manage billing ---
    if (action === "cancel" && profile?.paystack_subscription_code) {
      if (!profile.paystack_email_token) {
        return NextResponse.json(
          { error: "No email token on file — contact support." },
          { status: 400 }
        );
      }
      await disableSubscription(
        profile.paystack_subscription_code,
        profile.paystack_email_token
      );
      await supabase
        .from("profiles")
        .update({ plan: "free", paystack_subscription_code: null, paystack_email_token: null, template_id: 1 })
        .eq("id", userId);
      return NextResponse.json({ cancelled: true });
    }

    // --- Already subscribed: show current status ---
    if (profile?.plan === "pro" && profile?.paystack_subscription_code) {
      try {
        const sub = await fetchSubscription(profile.paystack_subscription_code);
        return NextResponse.json({ alreadyPro: true, status: sub.status });
      } catch {
        // subscription may have been cancelled externally; fall through to re-subscribe
      }
    }

    // --- New subscription ---
    const callbackUrl = `${APP_URL}/api/paystack/callback?user_id=${userId}`;
    const result = await initializeSubscription(email, userId, callbackUrl);
    return NextResponse.json({ url: result.authorization_url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}