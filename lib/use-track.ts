"use client";

import { useEffect, useRef } from "react";

function getVisitorId(): string {
  let id = localStorage.getItem("fh_vid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("fh_vid", id);
  }
  return id;
}

export function useTrack(profileId: string) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    const visitorId = getVisitorId();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile_id: profileId,
        event_type: "page_view",
        visitor_id: visitorId,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  }, [profileId]);

  function track(event_type: string) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile_id: profileId,
        event_type,
        visitor_id: getVisitorId(),
      }),
    }).catch(() => {});
  }

  return { track };
}
