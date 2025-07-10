'use server';

import { ActionError } from '@/app/errors';
import { adminProcedure } from '@/lib/safe-action';

export const getLogs = adminProcedure.action(async ({ ctx: { supabase } }) => {
  const { data, error } = await supabase
    .from('logger')
    .select('*,profile:profiles(*)')
    .order('created_at', { ascending: false });
  if (error) throw new ActionError(error.message);
  return data;
});
