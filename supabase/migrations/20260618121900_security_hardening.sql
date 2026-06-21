-- BloodChain Pakistan — security hardening from Supabase advisor findings.

-- 1) Donor privacy: anonymous visitors must NOT be able to enumerate nearby
--    donors by calling the matching RPC directly (/rest/v1/rpc/find_eligible_donors).
--    Admin matching runs as an authenticated user, so keep that grant.
revoke execute on function
  public.find_eligible_donors(blood_group, double precision, double precision, integer, integer)
  from anon, public;
grant execute on function
  public.find_eligible_donors(blood_group, double precision, double precision, integer, integer)
  to authenticated, service_role;

-- 2) Pin search_path on SECURITY DEFINER / trigger functions so they can't be
--    influenced by a caller-set search_path (advisor: function_search_path_mutable).
alter function public.set_location_from_coords() set search_path = public;
alter function public.set_request_code() set search_path = public;
alter function public.set_updated_at() set search_path = public;
alter function public.apply_donation() set search_path = public;
alter function public.compatible_donor_groups(blood_group) set search_path = public;
