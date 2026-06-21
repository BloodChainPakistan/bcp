-- BloodChain Pakistan — Sprint 4 (foundation): lat/lng → location
-- The client (or a geocoder) supplies lat + lng; a trigger builds the PostGIS
-- geography Point. This keeps the client simple (just two numbers) and avoids
-- serializing geography from the browser. Required so find_eligible_donors()
-- can actually match donors by distance.

alter table donors         add column lat double precision, add column lng double precision;
alter table blood_requests add column lat double precision, add column lng double precision;

create or replace function set_location_from_coords()
returns trigger language plpgsql as $$
begin
  if new.lat is not null and new.lng is not null then
    new.location := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;
  end if;
  return new;
end;
$$;

create trigger trg_donors_location
  before insert or update on donors
  for each row execute function set_location_from_coords();

create trigger trg_requests_location
  before insert or update on blood_requests
  for each row execute function set_location_from_coords();
