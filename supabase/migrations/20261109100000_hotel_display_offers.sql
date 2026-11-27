create table if not exists public.hotel_display_offers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.books_organizations(id) on delete cascade,
  placement text not null check (placement in ('home_carousel', 'menu_banner')),
  title text not null,
  description text not null,
  badge_text text,
  icon_key text check (icon_key in ('Crown', 'Utensils', 'Coffee')),
  icon_color text check (icon_color in ('gold', 'green', 'purple')),
  emoji text,
  daily_start_time time,
  daily_end_time time,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, placement, title),
  check (
    (placement = 'home_carousel' and badge_text is not null and icon_key is not null and icon_color is not null)
    or (placement = 'menu_banner' and emoji is not null and daily_start_time is not null and daily_end_time is not null and daily_start_time < daily_end_time)
  )
);

create index if not exists hotel_display_offers_active_order_idx
  on public.hotel_display_offers (organization_id, placement, display_order)
  where is_active;

alter table public.hotel_display_offers enable row level security;
revoke all on public.hotel_display_offers from public, anon, authenticated;
grant select, insert, update, delete on public.hotel_display_offers to service_role;

create or replace function public.seed_hotel_display_offers(target_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.hotel_display_offers (
    organization_id, placement, title, description, badge_text, icon_key, icon_color,
    emoji, daily_start_time, daily_end_time, display_order
  )
  values
    (target_organization_id, 'home_carousel', 'Welcome Special', '25% off your first stay + complimentary spa access', 'Limited Time', 'Crown', 'gold', null, null, null, 0),
    (target_organization_id, 'home_carousel', 'Lunch Special', 'Buy one, get one free on signature dishes', 'Until 3 PM', 'Utensils', 'green', null, null, null, 1),
    (target_organization_id, 'home_carousel', 'Evening Delight', 'Live jazz band + 30% off premium cocktails', '7 PM - 11 PM', 'Coffee', 'purple', null, null, null, 2),
    (target_organization_id, 'menu_banner', 'Lunch Special', 'Order now and skip the queue - you come first!', null, null, null, '🍽️', '11:00', '15:00', 0),
    (target_organization_id, 'menu_banner', 'Evening Delight', 'Live jazz band + special cocktail prices', null, null, null, '🎷', '17:00', '23:00', 1)
  on conflict (organization_id, placement, title) do nothing;
end;
$$;
revoke all on function public.seed_hotel_display_offers(uuid) from public, anon, authenticated;

do $$
declare tenant record;
begin
  for tenant in select organization_id from public.hotel_tenant_settings loop
    perform public.seed_hotel_display_offers(tenant.organization_id);
  end loop;
end;
$$;

create or replace function public.seed_new_hotel_display_offers()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  perform public.seed_hotel_display_offers(new.organization_id);
  return new;
end;
$$;
revoke all on function public.seed_new_hotel_display_offers() from public, anon, authenticated;
drop trigger if exists hotel_display_offers_seed_tenant on public.hotel_tenant_settings;
create trigger hotel_display_offers_seed_tenant
after insert on public.hotel_tenant_settings
for each row execute function public.seed_new_hotel_display_offers();

notify pgrst, 'reload schema';
