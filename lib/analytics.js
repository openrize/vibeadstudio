/**
 * Lightweight marketing analytics — forwards to logAction and optional gtag.
 */
export function trackMarketingEvent(eventName, details = {}, logAction) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      event_category: "marketing",
      ...(typeof details === "object" && details !== null ? details : { label: String(details) }),
    });
  }

  if (logAction) {
    logAction({
      action: eventName,
      details: typeof details === "string" ? details : JSON.stringify(details),
      status: "info",
    });
  }
}
