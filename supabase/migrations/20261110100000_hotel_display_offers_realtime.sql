create or replace function public.broadcast_hotel_display_offer_changes()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, realtime
as $$
declare
  target_organization_id uuid;
begin
  target_organization_id := case when tg_op = 'DELETE' then old.organization_id else new.organization_id end;
  perform realtime.send(
    payload := '{}'::jsonb,
    event := 'offers_changed',
    topic := 'hotel-display-offers:' || target_organization_id::text,
    private := false
  );
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function public.broadcast_hotel_display_offer_changes() from public, anon, authenticated;

drop trigger if exists hotel_display_offers_broadcast_changes on public.hotel_display_offers;
create trigger hotel_display_offers_broadcast_changes
after insert or update or delete on public.hotel_display_offers
for each row execute function public.broadcast_hotel_display_offer_changes();
