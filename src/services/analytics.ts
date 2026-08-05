import { supabase } from "./supabase";

// ─── Helpers for Session tracking and Device detection ─────────────────────────
function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem("fashionking_analytics_session");
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("fashionking_analytics_session", sid);
    }
    return sid;
  } catch {
    return "fallback-session";
  }
}

function getDeviceType(): "mobile" | "desktop" {
  try {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|iphone|ipad|android|webos|iemobile|opera mini/i.test(ua);
    return isMobile ? "mobile" : "desktop";
  } catch {
    return "desktop";
  }
}

// ─── Log to local storage fallback ───────────────────────────────────────────
function logLocalEvent(eventType: string, eventName: string) {
  try {
    const raw = localStorage.getItem("fashionking_analytics_events");
    const events = raw ? JSON.parse(raw) : [];
    
    events.push({
      id: events.length + 1,
      event_type: eventType,
      event_name: eventName,
      user_session_id: getOrCreateSessionId(),
      device_type: getDeviceType(),
      created_at: new Date().toISOString()
    });
    
    // Cap at 1000 events to prevent localstorage bloat
    if (events.length > 1000) {
      events.shift();
    }
    
    localStorage.setItem("fashionking_analytics_events", JSON.stringify(events));
  } catch (err) {
    console.error("Local analytics logging failed:", err);
  }
}

// ─── Core Analytics Service ──────────────────────────────────────────────────
export const analyticsService = {
  async logEvent(eventType: "page_visit" | "category_view" | "product_click" | "lead_click", eventName: string) {
    const sessionId = getOrCreateSessionId();
    const deviceType = getDeviceType();

    // Console logging for verification
    console.log(`[Analytics] event_type=${eventType} event_name=${eventName}`);

    try {
      if (supabase) {
        const { error } = await supabase
          .from("analytics_events")
          .insert([
            {
              event_type: eventType,
              event_name: eventName,
              user_session_id: sessionId,
              device_type: deviceType
            }
          ]);
        if (error) throw error;
      } else {
        logLocalEvent(eventType, eventName);
      }
    } catch (err) {
      console.warn("[Analytics Service] Failed sending event to Supabase, logging locally.", err);
      logLocalEvent(eventType, eventName);
    }
  },

  trackPageVisit(pageName: string): void {
    this.logEvent("page_visit", pageName);
  },

  trackCategoryView(categoryId: string): void {
    this.logEvent("category_view", categoryId);
  },

  trackProductClick(productId: string, productTitle: string): void {
    this.logEvent("product_click", `${productId}::${productTitle}`);
  },

  trackLeadClick(actionLabel: string): void {
    this.logEvent("lead_click", actionLabel);
  }
};
