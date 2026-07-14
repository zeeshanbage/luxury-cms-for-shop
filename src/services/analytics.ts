import type { AppointmentRequest } from "@/types";

/**
 * Service to simulate reporting user engagement metrics for private fitting bookings and consultations.
 */
export const analyticsService = {
  trackPageVisit(pageName: string): void {
    // In production, this would send tracking requests to an analytics server.
    console.log(`[Analytics] Page visited: ${pageName}`);
  },

  trackAppointmentRequest(data: AppointmentRequest): void {
    console.log(`[Analytics] Appointment requested for ${data.name} regarding service type: ${data.serviceType}`);
  },

  trackCTAClick(buttonLabel: string): void {
    console.log(`[Analytics] CTA button clicked: ${buttonLabel}`);
  },
};
