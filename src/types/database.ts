/**
 * App-facing database types.
 *
 * Authoritative types are generated from the LIVE database into ./supabase.ts:
 *   npx supabase gen types typescript --linked > src/types/supabase.ts
 *
 * Regenerate supabase.ts after every migration. The friendly aliases below are
 * what the app imports; they stay stable while supabase.ts is regenerated.
 */
import type { Database } from './supabase';

export type BloodGroup = Database['public']['Enums']['blood_group'];
export type GenderType = Database['public']['Enums']['gender_type'];
export type DonorStatus = Database['public']['Enums']['donor_status'];
export type RequestStatus = Database['public']['Enums']['request_status'];
export type MatchStatus = Database['public']['Enums']['match_status'];
export type UrgencyLevel = Database['public']['Enums']['urgency_level'];
export type ContactSource = Database['public']['Enums']['contact_source'];
export type PartnerType = Database['public']['Enums']['partner_type'];

export type Donor = Database['public']['Tables']['donors']['Row'];
export type DonorInsert = Database['public']['Tables']['donors']['Insert'];
export type VolunteerInsert = Database['public']['Tables']['volunteers']['Insert'];
export type PartnerInsert = Database['public']['Tables']['partners']['Insert'];
export type BloodRequestInsert = Database['public']['Tables']['blood_requests']['Insert'];

/** Row shape returned by the find_eligible_donors() RPC. */
export interface EligibleDonor {
  donor_id: string;
  blood_group: BloodGroup;
  city: string;
  distance_m: number;
}
