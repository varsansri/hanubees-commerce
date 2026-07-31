-- ===========================================================================
-- Hanubees Commerce — schema
--
-- Multi-tenant. Every row belongs to a store, and every store has one owner.
-- Isolation is enforced by Row Level Security rather than by application code:
-- a merchant physically cannot read another merchant's rows even if a query is
-- written wrongly. That is the whole reason for choosing Postgres RLS here.
--
-- Run this once in the Supabase SQL editor.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------ stores
create table if not exists stores (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  handle      text not null unique check (handle ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'),
  name        text not null,
  tagline     text not null default '',
  currency    text not null default 'INR' check (currency in ('INR','USD','EUR','GBP')),
  plan        text not null default 'starter' check (plan in ('starter','growth','scale')),
  accent      text not null default '#a06912',
  custom_domain text unique,
  created_at  timestamptz not null default now()
);
create index if not exists stores_owner_idx on stores (owner_id);

-- ---------------------------------------------------------------- products
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  store_id      uuid not null references stores (id) on delete cascade,
  title         text not null,
  slug          text not null,
  description   text not null default '',
  status        text not null default 'draft' check (status in ('active','draft','archived')),
  price         integer not null default 0 check (price >= 0),  -- minor units (paise)
  compare_at_price integer check (compare_at_price >= 0),
  category      text not null default '',
  tags          text[] not null default '{}',
  images        text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (store_id, slug)
);
create index if not exists products_store_idx on products (store_id);

create table if not exists variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products (id) on delete cascade,
  title       text not null default 'Default',
  sku         text not null default '',
  price       integer not null default 0 check (price >= 0),
  inventory   integer not null default 0,
  position    integer not null default 0
);
create index if not exists variants_product_idx on variants (product_id);

-- --------------------------------------------------------------- customers
create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references stores (id) on delete cascade,
  name        text not null,
  email       text not null,
  phone       text,
  subscribed  boolean not null default false,
  location    text not null default '',
  created_at  timestamptz not null default now(),
  unique (store_id, email)
);
create index if not exists customers_store_idx on customers (store_id);

-- ------------------------------------------------------------------ orders
-- Order numbers are per store and gapless-ish, so merchants see #1001, #1002.
create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  store_id           uuid not null references stores (id) on delete cascade,
  number             integer not null,
  customer_id        uuid references customers (id) on delete set null,
  customer_name      text not null default '',
  customer_email     text not null default '',
  subtotal           integer not null default 0,
  shipping           integer not null default 0,
  tax                integer not null default 0,
  total              integer not null default 0,
  status             text not null default 'open'         check (status in ('open','closed','cancelled')),
  payment_status     text not null default 'pending'      check (payment_status in ('paid','pending','refunded','partially_refunded')),
  fulfillment_status text not null default 'unfulfilled'  check (fulfillment_status in ('unfulfilled','fulfilled','partial')),
  channel            text not null default 'online'       check (channel in ('online','pos','instagram','whatsapp')),
  shipping_address   jsonb not null default '{}'::jsonb,
  placed_at          timestamptz not null default now(),
  unique (store_id, number)
);
create index if not exists orders_store_idx on orders (store_id, placed_at desc);

create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders (id) on delete cascade,
  product_id    uuid references products (id) on delete set null,
  title         text not null,
  variant_title text not null default '',
  quantity      integer not null default 1 check (quantity > 0),
  price         integer not null default 0,
  image         text not null default ''
);
create index if not exists order_items_order_idx on order_items (order_id);

-- --------------------------------------------------------------- discounts
create table if not exists discounts (
  id         uuid primary key default gen_random_uuid(),
  store_id   uuid not null references stores (id) on delete cascade,
  code       text not null,
  type       text not null default 'percentage' check (type in ('percentage','fixed','free_shipping')),
  value      integer not null default 0,
  used       integer not null default 0,
  usage_limit integer,
  status     text not null default 'active' check (status in ('active','scheduled','expired')),
  starts_at  timestamptz not null default now(),
  ends_at    timestamptz,
  unique (store_id, code)
);

-- ===========================================================================
-- Row Level Security
--
-- One helper decides everything: does the signed-in user own this store?
-- Every table's policy routes through it, so there is a single place to audit.
-- ===========================================================================

create or replace function owns_store(sid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from stores s where s.id = sid and s.owner_id = auth.uid()
  );
$$;

alter table stores      enable row level security;
alter table products    enable row level security;
alter table variants    enable row level security;
alter table customers   enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table discounts   enable row level security;

drop policy if exists stores_own on stores;
create policy stores_own on stores
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists products_own on products;
create policy products_own on products
  for all using (owns_store(store_id)) with check (owns_store(store_id));

drop policy if exists variants_own on variants;
create policy variants_own on variants
  for all using (exists (select 1 from products p where p.id = product_id and owns_store(p.store_id)))
  with check (exists (select 1 from products p where p.id = product_id and owns_store(p.store_id)));

drop policy if exists customers_own on customers;
create policy customers_own on customers
  for all using (owns_store(store_id)) with check (owns_store(store_id));

drop policy if exists orders_own on orders;
create policy orders_own on orders
  for all using (owns_store(store_id)) with check (owns_store(store_id));

drop policy if exists order_items_own on order_items;
create policy order_items_own on order_items
  for all using (exists (select 1 from orders o where o.id = order_id and owns_store(o.store_id)))
  with check (exists (select 1 from orders o where o.id = order_id and owns_store(o.store_id)));

drop policy if exists discounts_own on discounts;
create policy discounts_own on discounts
  for all using (owns_store(store_id)) with check (owns_store(store_id));

-- Storefronts are public: anyone may read active products of any store.
-- This is a separate, deliberately narrow policy — it exposes active products
-- only, never drafts, and never orders or customers.
drop policy if exists products_public_read on products;
create policy products_public_read on products
  for select to anon, authenticated using (status = 'active');

drop policy if exists stores_public_read on stores;
create policy stores_public_read on stores
  for select to anon, authenticated using (true);

drop policy if exists variants_public_read on variants;
create policy variants_public_read on variants
  for select to anon, authenticated
  using (exists (select 1 from products p where p.id = product_id and p.status = 'active'));

-- ------------------------------------------------------- next order number
create or replace function next_order_number(sid uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  select coalesce(max(number), 1000) + 1 from orders where store_id = sid;
$$;

-- Product images bucket. Public read so storefronts can serve them.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists product_images_read on storage.objects;
create policy product_images_read on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');

drop policy if exists product_images_write on storage.objects;
create policy product_images_write on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists product_images_delete on storage.objects;
create policy product_images_delete on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');
