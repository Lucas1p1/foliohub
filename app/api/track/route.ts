import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const { profile_id, event_type, visitor_id, referrer } = await request.json();

    if (!profile_id || !event_type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = getServiceClient();
    await supabase.from("page_events").insert({
      profile_id,
      event_type,
      visitor_id: visitor_id ?? null,
      referrer: referrer ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
