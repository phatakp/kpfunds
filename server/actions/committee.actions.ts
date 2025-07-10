'use server';

import { ActionError } from '@/app/errors';
import { CommitteeMemberPkSchema, CommitteeSchema } from '@/app/schemas';
import type { TMemberWithProfile } from '@/app/types';
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from '@/lib/safe-action';
import { z } from 'zod/v4';

export const getAllCommittees = publicProcedure.action(
  async ({ ctx: { supabase } }) => {
    const { data } = await supabase.from('committees').select('*');
    return data;
  }
);

export const updateCommitteeBal = publicProcedure
  .inputSchema(CommitteeSchema)
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const { data, error } = await supabase
      .from('committees')
      .update({ balance: parsedInput.balance })
      .eq('name', parsedInput.name)
      .select()
      .single();
    if (error) throw new ActionError(error.message);
    return data;
  });

export const getAllCommitteeMembers = publicProcedure
  .inputSchema(z.object({ commmitteeName: z.string() }))
  .action(async ({ parsedInput: { commmitteeName }, ctx: { supabase } }) => {
    const { data } = await supabase
      .from('commitee_members')
      .select('*,profile:profiles(*)')
      .eq('committee_name', commmitteeName)
      .eq('is_active', true)
      .overrideTypes<TMemberWithProfile[]>();
    return data;
  });

export const getCommitteeMember = publicProcedure
  .inputSchema(CommitteeMemberPkSchema)
  .action(
    async ({
      parsedInput: { committee_name, member_id },
      ctx: { supabase },
    }) => {
      const { data } = await supabase
        .from('commitee_members')
        .select('*,user:profiles(*)')
        .eq('committee_name', committee_name)
        .eq('member_id', member_id)
        .single();
      return data;
    }
  );

export const getAllPendingApprovals = adminProcedure.action(
  async ({ ctx: { supabase } }) => {
    const { data } = await supabase
      .from('commitee_members')
      .select('*,user:profiles(*)')
      .eq('is_active', false);
    return data;
  }
);

export const addMember = protectedProcedure
  .inputSchema(CommitteeMemberPkSchema)
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const { data, error } = await supabase
      .from('commitee_members')
      .insert([{ ...parsedInput, is_active: false }])
      .select();
    if (error) throw new ActionError(error.message);
    return data;
  });

export const deleteMember = adminProcedure
  .inputSchema(CommitteeMemberPkSchema)
  .action(
    async ({
      parsedInput: { committee_name, member_id },
      ctx: { supabase },
    }) => {
      const { data, error } = await supabase.rpc('delete_member', {
        committeename: committee_name,
        memberid: member_id,
      });
      if (error) throw new ActionError(error.message);
      return data;
    }
  );

export const approveMember = adminProcedure
  .inputSchema(CommitteeMemberPkSchema)
  .action(
    async ({
      parsedInput: { committee_name, member_id },
      ctx: { supabase },
    }) => {
      const { data, error } = await supabase.rpc('approve_member', {
        committeename: committee_name,
        memberid: member_id,
      });

      if (error) throw new ActionError(error.message);
      return data;
    }
  );
