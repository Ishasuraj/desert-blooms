create table notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  channel text not null,
  status text not null,
  sent_at timestamptz default now()
);

alter table notifications enable row level security;
create policy "deny all by default" on notifications for all using (false);
