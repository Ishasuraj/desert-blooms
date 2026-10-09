alter table orders add column if not exists idempotency_key uuid;
alter table orders add column if not exists request_fingerprint text;

create unique index if not exists orders_idempotency_key_unique
  on orders (idempotency_key)
  where idempotency_key is not null;
