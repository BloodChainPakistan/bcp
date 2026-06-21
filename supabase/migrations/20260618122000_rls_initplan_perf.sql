-- BloodChain Pakistan — RLS performance: wrap auth calls in a scalar subquery so
-- Postgres evaluates is_admin()/auth.uid() ONCE per query instead of once per row
-- (Supabase advisor: auth_rls_initplan). Semantically identical — only the
-- evaluation plan changes. Done in place with ALTER POLICY (no drop/recreate gap).

-- profiles
alter policy profiles_admin_all   on profiles  using ((select is_admin())) with check ((select is_admin()));
alter policy profiles_select_self on profiles  using (((id = (select auth.uid())) or (select is_admin())));
alter policy profiles_update_self on profiles  using ((id = (select auth.uid()))) with check ((id = (select auth.uid())));

-- donors
alter policy donors_admin_all     on donors    using ((select is_admin())) with check ((select is_admin()));
alter policy donors_select_self   on donors    using ((profile_id = (select auth.uid())));

-- volunteers
alter policy volunteers_admin_all   on volunteers using ((select is_admin())) with check ((select is_admin()));
alter policy volunteers_select_self on volunteers using ((profile_id = (select auth.uid())));

-- partners
alter policy partners_admin_all   on partners  using ((select is_admin())) with check ((select is_admin()));
alter policy partners_select_self on partners  using ((profile_id = (select auth.uid())));

-- hospitals
alter policy hospitals_admin_all   on hospitals using ((select is_admin())) with check ((select is_admin()));
alter policy hospitals_select_self on hospitals using ((profile_id = (select auth.uid())));
alter policy hospitals_update_self on hospitals using ((profile_id = (select auth.uid()))) with check ((profile_id = (select auth.uid())));
