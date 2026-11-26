drop trigger if exists hotel_display_offers_broadcast_changes
  on public.hotel_display_offers;

drop function if exists public.broadcast_hotel_display_offer_changes();
