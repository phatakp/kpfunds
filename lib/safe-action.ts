import {
  ActionError,
  AuthenticationError,
  AuthorizationError,
  ProfileNotFoundError,
} from '@/app/errors';
import type { TUserProfile } from '@/app/types';
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { createSupabaseServer } from './supabase/server';

export const publicProcedure = createSafeActionClient({
  defaultValidationErrorsShape: 'flattened',
  throwValidationErrors: true,
  handleServerError(e) {
    console.error('Action error:', e.message);
    if (e instanceof ActionError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
  const supabase = await createSupabaseServer();

  return next({ ctx: { supabase } });
});

export const protectedProcedure = publicProcedure.use(async ({ next, ctx }) => {
  const { supabase } = ctx;
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new AuthenticationError('Not Authenticated');

  // Return the next middleware with `user` value in the context
  return next({ ctx: { ...ctx, user: data.user } });
});

export const profileProcedure = protectedProcedure.use(
  async ({ next, ctx }) => {
    const { supabase, user } = ctx;

    const { data: profile } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new ProfileNotFoundError('Profile Not found');
    }

    // Return the next middleware with `user` value in the context
    return next({ ctx: { ...ctx, profile: profile as TUserProfile } });
  }
);

export const adminProcedure = profileProcedure.use(async ({ next, ctx }) => {
  const { profile } = ctx;

  if (!profile.is_admin) {
    throw new AuthorizationError('Not Authorized for this action');
  }

  await Promise.resolve();

  // Return the next middleware with `user` value in the context
  return next({ ctx });
});
