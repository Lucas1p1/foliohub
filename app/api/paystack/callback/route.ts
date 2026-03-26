import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendProUpgradeEmail } from "@/lib/emails";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  const userId = searchParams.get("user_id");

  if (!reference || !userId) {
    return NextResponse.redirect(`${APP_URL}/dashboard/settings?error=missing_params`);
  }

  // Verify the transaction with Paystack
  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );
  const verifyJson = await verifyRes.json();

  if (!verifyJson.status || verifyJson.data?.status !== "success") {
    return NextResponse.redirect(`${APP_URL}/dashboard/settings?error=payment_failed`);
  }

  const txData = verifyJson.data;
  const subscriptionCode: string | undefined =
    txData.subscription?.subscription_code ?? txData.metadata?.subscription_code;
  const emailToken: string | undefined =
    txData.subscription?.email_token ?? txData.metadata?.email_token;

  const supabase = getServiceClient();
  await supabase
    .from("profiles")
    .update({
      plan: "pro",
      paystack_subscription_code: subscriptionCode ?? null,
      paystack_email_token: emailToken ?? null,
    })
    .eq("id", userId);

  // Send upgrade email
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

  return NextResponse.redirect(`${APP_URL}/dashboard/settings?upgraded=true`);
}