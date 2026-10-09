create extension if not exists pgcrypto;

create table customers (
  id uuid primary key references auth.users(id),
  full_name text,
  phone text,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  status text not null default 'pending',
  currency text not null default 'KWD',
  total_amount numeric(10,3) not null,
  payment_gateway_reference text,
  whatsapp_sent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  tool_id text not null,
  tool_name text not null,
  quantity integer not null,
  unit_price numeric(10,3) not null,
  subtotal numeric(10,3) not null
);

alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "deny all by default" on customers for all using (false);
create policy "deny all by default" on orders for all using (false);
create policy "deny all by default" on order_items for all using (false);
