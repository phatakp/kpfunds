import { BUILDINGS, EVENT_TYPES } from '@/lib/constants';
import { createZodObject, getFlatsForBuilding } from '@/lib/utils';
import { z } from 'zod/v4';
import type {
  TAnnadaanBooking,
  TAnnadaanItem,
  TCollection,
  TCommittee,
  TCommitteeMember,
  TEvent,
  TUserProfile,
} from './types';

//Auth
export const LoginSchema = z.object({ email: z.email({ error: 'Required' }) });
export const VerifyOTPSchema = z.object({
  email: z.email({ error: 'Required' }),
  token: z.string().min(6, { error: 'Invalid OTP' }),
});

export const ProfileSchema = createZodObject<TUserProfile>({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  image: z.nullable(z.string()),
  building: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
  flat: z.coerce.number().default(0),
  is_admin: z.boolean(),
  created_at: z.string(),
});

export const ProfileCreateSchema = ProfileSchema.omit({
  is_admin: true,
  created_at: true,
}).check((ctx) => {
  if (!getFlatsForBuilding(ctx.value.building).includes(ctx.value.flat)) {
    ctx.issues.push({
      code: 'custom',
      message: 'Invalid Flat Number',
      input: ctx.value.flat,
      path: ['flat'],
      continue: true, // make this issue continuable (default: false)
    });
  }
});

//Committee

export const CommitteeSchema = createZodObject<TCommittee>({
  name: z.string(),
  balance: z.coerce.number(),
});

export const CommitteeMemberSchema = createZodObject<TCommitteeMember>({
  committee_name: z.string(),
  member_id: z.uuid(),
  is_active: z.boolean(),
});

export const CommitteeMemberPkSchema = CommitteeMemberSchema.omit({
  is_active: true,
});

//Event
export const EventSchema = createZodObject<TEvent>({
  slug: z.string(),
  name: z.string(),
  year: z.coerce.number(),
  committee_name: z.string(),
  type: z.enum(EVENT_TYPES),
  is_active: z.boolean(),
});

export const EventCreateSchema = EventSchema.omit({
  is_active: true,
  slug: true,
});

//Annadaan
export const AnnadaanItemSchema = createZodObject<TAnnadaanItem>({
  item_name: z.string(),
  quantity: z.coerce.number(),
  price: z.coerce.number(),
  amount: z.coerce.number(),
});

export const BookingSchema = createZodObject<TAnnadaanBooking>({
  item_name: z.string(),
  booked_qty: z.coerce.number(),
  booked_by_building: z.enum(BUILDINGS),
  booked_by_flat: z.number(),
  booked_by_name: z.string(),
  amount: z.coerce.number(),
  year: z.number(),
  amount_paid_to: z.string(),
  created_at: z.string(),
});

export const BookingPkSchema = BookingSchema.pick({
  item_name: true,
  booked_by_building: true,
  booked_by_flat: true,
  booked_by_name: true,
  year: true,
});

export const BookingFormSchema = z
  .object({
    bookByName: z.string('Required').min(1, 'Required'),
    receiver: z.string('Required').min(1, 'Required'),
    paidTo: z.string(),
    building: z.enum(BUILDINGS, 'Required'),
    flat: z.coerce.number('Required'),
    year: z.coerce.number(),
    bookings: z.array(
      z.object({
        itemName: z.string('Required'),
        totQty: z.coerce.number('Required'),
        bookQty: z.coerce.number('Required').min(0.01),
        price: z.coerce.number('Required'),
      })
    ),
  })
  .check((ctx) => {
    if (!getFlatsForBuilding(ctx.value.building).includes(ctx.value.flat)) {
      ctx.issues.push({
        code: 'custom',
        message: 'Invalid Flat Number',
        input: ctx.value.flat,
        path: ['flat'],
        continue: true, // make this issue continuable (default: false)
      });
    }
  });

//Collection
export const CollectionSchema = createZodObject<TCollection>({
  id: z.uuid(),
  donor_name: z.string(),
  donor_building: z.enum(BUILDINGS),
  donor_flat: z.coerce.number(),
  amount: z.coerce.number(),
  receiver_name: z.string(),
  payment_type: z.enum(['cash', 'online']),
  created_at: z.string(),
  event_type: z.enum(EVENT_TYPES),
  logged_by_user: z.nullable(z.uuid()),
});
