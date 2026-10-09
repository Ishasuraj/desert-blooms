create sequence if not exists order_ref_seq start 100001;
alter table orders add column order_ref text unique
  default ('DB-' || nextval('order_ref_seq')::text);
alter table notifications add column error_message text;
