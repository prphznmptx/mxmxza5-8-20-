import { useEffect, useState } from "react";
import { useHotelTenant } from "../lib/hotelTenant";

export type HotelDisplayOffer = {
  title: string;
  description: string;
  badge_text: string | null;
  icon_key: "Crown" | "Utensils" | "Coffee" | null;
  icon_color: "gold" | "green" | "purple" | null;
  emoji: string | null;
  daily_start_time: string | null;
  daily_end_time: string | null;
  display_order: number;
};

export function useHotelDisplayOffers(placement: "home_carousel" | "menu_banner") {
  const { tenant } = useHotelTenant();
  const [offers, setOffers] = useState<HotelDisplayOffer[]>([]);

  useEffect(() => {
    let active = true;
    setOffers([]);
    if (!tenant) return () => { active = false; };

    const loadOffers = async () => {
      try {
        const response = await fetch(`/api/hotel-display-offers?placement=${placement}`, { cache: "no-store" });
        const payload = await response.json().catch(() => null) as { offers?: HotelDisplayOffer[] } | null;
        if (!response.ok) throw new Error("Hotel offers could not be loaded.");
        if (active) setOffers(payload?.offers || []);
      } catch (error) {
        console.error("Unable to load hotel display offers", error);
      }
    };

    void loadOffers();
    return () => {
      active = false;
    };
  }, [placement, tenant?.organizationId]);

  return offers;
}
