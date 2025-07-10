import type { Database } from '@/lib/supabase/types';

//Enum Types
export type TBuilding = Database['public']['Enums']['building_enum'];
export type TEventType = Database['public']['Enums']['event_type_enum'];

//DB Table Types
export type TAnnadaanItem =
  Database['public']['Tables']['annadaan_items']['Row'];
export type TAnnadaanBooking =
  Database['public']['Tables']['annadaan_bookings']['Row'];
export type TCommittee = Database['public']['Tables']['committees']['Row'];
export type TCommitteeMember =
  Database['public']['Tables']['commitee_members']['Row'];
export type TCollection = Database['public']['Tables']['collections']['Row'];
export type TPaymentType =
  Database['public']['Tables']['collections']['Row']['payment_type'];
export type TEvent = Database['public']['Tables']['events']['Row'];
export type TUserProfile = Database['public']['Tables']['profiles']['Row'];
export type TLog = Database['public']['Tables']['logger']['Row'];

//Custom
export type TItemWithBookings = TAnnadaanItem & {
  bookings: TAnnadaanBooking[];
};
export type TMemberWithProfile = TCommitteeMember & {
  user: TUserProfile;
};
