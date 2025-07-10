'use server';

import { ActionError } from '@/app/errors';
import {
  LoginSchema,
  ProfileCreateSchema,
  VerifyOTPSchema,
} from '@/app/schemas';
import { protectedProcedure, publicProcedure } from '@/lib/safe-action';
import { getURL } from '@/lib/utils';

export const loginWithGoogle = publicProcedure.action(
  async ({ ctx: { supabase } }) => {
    const redirectUrl = `${getURL()}/api/auth/callback`;
    console.log({ redirectUrl });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) throw new ActionError(error.message);
    return data;
  }
);

export const loginWithEmailOTP = publicProcedure
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput: { email }, ctx: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${getURL()}/api/auth/confirm`,
      },
    });
    if (error) throw new ActionError(error.message);
    return data;
  });

export const verifyEmailOTP = publicProcedure
  .inputSchema(VerifyOTPSchema)
  .action(async ({ parsedInput: { email, token }, ctx: { supabase } }) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw new ActionError(error.message);
    return data;
  });

export const logout = protectedProcedure.action(
  async ({ ctx: { supabase } }) => {
    return await supabase.auth.signOut();
  }
);

export const isLoggedInProfile = publicProcedure.action(
  async ({ ctx: { supabase } }) => {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      return { profile, user: data.user };
    }
    return { user: data.user };
  }
);

export const createProfile = publicProcedure
  .inputSchema(ProfileCreateSchema)
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([parsedInput])
      .select();
    if (error) throw new ActionError(error.message);
    return data;
  });
