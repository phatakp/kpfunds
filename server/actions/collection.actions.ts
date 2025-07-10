'use server';

import { BUILDINGS, EVENT_TYPES } from '@/lib/constants';
import { profileProcedure } from '@/lib/safe-action';
import { z } from 'zod/v4';

export const getAllCollectionsbyBuilding = profileProcedure
  .inputSchema(
    z.object({ building: z.enum(BUILDINGS), type: z.enum(EVENT_TYPES) })
  )
  .action(async ({ parsedInput: { building, type }, ctx: { supabase } }) => {
    const { data } = await supabase
      .from('collections')
      .select('*')
      .eq('donor_building', building)
      .eq('event_type', type)
      .order('donor_flat');

    return data;
  });

export const getCollectionsbyReceiver = profileProcedure
  .inputSchema(z.object({ type: z.enum(EVENT_TYPES) }))
  .action(async ({ parsedInput: { type }, ctx: { supabase } }) => {
    const { data } = await supabase
      .from('collections')
      .select('total:amount.sum(),receiver_name')
      .eq('event_type', type);

    return data;
  });
