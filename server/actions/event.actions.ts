'use server';

import { ActionError } from '@/app/errors';
import { EventCreateSchema } from '@/app/schemas';
import { EVENT_TYPES } from '@/lib/constants';
import { adminProcedure, publicProcedure } from '@/lib/safe-action';
import { slugify } from '@/lib/utils';
import { z } from 'zod/v4';

export const getAllEvents = publicProcedure.action(
  async ({ ctx: { supabase } }) => {
    const { data } = await supabase.from('events').select('*').order('type');
    return data;
  }
);

export const getAllEventsByType = publicProcedure
  .inputSchema(z.object({ type: z.enum(EVENT_TYPES) }))
  .action(async ({ parsedInput: { type }, ctx: { supabase } }) => {
    const { data } = await supabase.from('events').select('*').eq('type', type);
    return data;
  });

export const getEventBySlug = publicProcedure
  .inputSchema(z.object({ slug: z.string() }))
  .action(async ({ parsedInput: { slug }, ctx: { supabase } }) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw new ActionError(error.message);
    return data;
  });

export const createEvent = adminProcedure
  .inputSchema(EventCreateSchema)
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const values = EventCreateSchema.safeParse(parsedInput);
    if (values.success) {
      const { data, error } = await supabase.rpc('create_event', {
        slug_input: `${slugify(values.data.name)}-${values.data.year}`,
        name_input: values.data.name,
        year: values.data.year,
        committeename: values.data.committee_name,
        type_input: values.data.type as string,
      });
      console.log({ data, error });

      if (error) throw new ActionError(error.message);
      return data;
    }
    throw new ActionError(values.error.message);
  });

export const activateEvent = adminProcedure
  .inputSchema(z.object({ slug: z.string() }))
  .action(async ({ parsedInput: { slug }, ctx: { supabase } }) => {
    const { data, error } = await supabase.rpc('activate_event', {
      slug_input: slug,
    });
    if (error) throw new ActionError(error.message);
    return data;
  });

export const deActivateEvent = adminProcedure
  .inputSchema(z.object({ slug: z.string() }))
  .action(async ({ parsedInput: { slug }, ctx: { supabase } }) => {
    const { data, error } = await supabase.rpc('deactivate_event', {
      slug_input: slug,
    });
    if (error) throw new ActionError(error.message);
    return data;
  });
