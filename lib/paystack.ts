const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const BASE = "https://api.paystack.co";

async function paystackRequest<T>(
  path: string,
  method: "GET" | "POST",
  body?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message ?? "Paystack error");
  return json.data as T;
}

export interface InitializeResult {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface SubscriptionData {
  subscription_code: string;
  email_token: string;
  status: string;
  plan: { plan_code: string };
  customer: { email: string; customer_code: string };
}

export interface CustomerData {
  customer_code: string;
  email: string;
}

/** Create or fetch a Paystack customer */
export async function createCustomer(
  email: string,
  metadata: Record<string, string>
): Promise<CustomerData> {
  return paystackRequest<CustomerData>("/customer", "POST", {
    email,
    metadata,
  });
}

/** Initialise a subscription transaction — redirects user to Paystack checkout */
export async function initializeSubscription(
  email: string,
  userId: string,
  callbackUrl: string
): Promise<InitializeResult> {
  // in lib/paystack.ts — initializeSubscription
return paystackRequest<InitializeResult>("/transaction/initialize", "POST", {
  email,
  plan: process.env.PAYSTACK_PLAN_CODE,
  callback_url: callbackUrl,
  metadata: {
    user_id: userId,
    cancel_action: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  },
});
}

/** Disable (cancel) a subscription */
export async function disableSubscription(
  subscriptionCode: string,
  emailToken: string
): Promise<void> {
  await paystackRequest("/subscription/disable", "POST", {
    code: subscriptionCode,
    token: emailToken,
  });
}

/** Fetch a subscription by code */
export async function fetchSubscription(
  subscriptionCode: string
): Promise<SubscriptionData> {
  return paystackRequest<SubscriptionData>(
    `/subscription/${subscriptionCode}`,
    "GET"
  );
}

/** Verify a Paystack webhook signature */
export function verifyWebhookSignature(
  body: string,
  paystackSignature: string
): boolean {
  // Node's crypto is available in Next.js API routes (Node runtime)
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");
  return hash === paystackSignature;
}