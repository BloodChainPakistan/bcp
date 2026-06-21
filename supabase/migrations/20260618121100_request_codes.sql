-- Human-readable request codes: BC-RQ-1001, BC-RQ-1002, …
-- Shown on the admin dashboard's emergency-request cards.

create sequence if not exists blood_request_code_seq start 1001;

alter table blood_requests
  add column if not exists request_code text unique;

create or replace function set_request_code()
returns trigger
language plpgsql
as $$
begin
  if new.request_code is null then
    new.request_code := 'BC-RQ-' || lpad(nextval('blood_request_code_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_request_code on blood_requests;
create trigger trg_set_request_code
  before insert on blood_requests
  for each row execute function set_request_code();

-- Backfill any existing rows.
update blood_requests
  set request_code = 'BC-RQ-' || lpad(nextval('blood_request_code_seq')::text, 4, '0')
  where request_code is null;
