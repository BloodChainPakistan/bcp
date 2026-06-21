-- BloodChain Pakistan — indexes for scale (filtering/sorting/search at millions of rows)
create extension if not exists pg_trgm;

-- Fast ILIKE search on names/phones (trigram GIN)
create index if not exists donors_name_trgm     on donors using gin (full_name gin_trgm_ops);
create index if not exists donors_phone_trgm     on donors using gin (phone gin_trgm_ops);
create index if not exists volunteers_name_trgm  on volunteers using gin (full_name gin_trgm_ops);
create index if not exists partners_name_trgm    on partners using gin (org_name gin_trgm_ops);

-- Sort/filter hot paths
create index if not exists donors_created_idx          on donors (created_at desc);
create index if not exists volunteers_status_idx       on volunteers (status);
create index if not exists volunteers_city_idx         on volunteers (lower(city));
create index if not exists volunteers_created_idx      on volunteers (created_at desc);
create index if not exists partners_status_idx         on partners (status);
create index if not exists partners_city_idx           on partners (lower(city));
create index if not exists partners_created_idx        on partners (created_at desc);
create index if not exists blood_requests_created_idx  on blood_requests (created_at desc);
