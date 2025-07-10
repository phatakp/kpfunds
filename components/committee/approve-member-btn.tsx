'use client';

import { approveMember } from '@/server/actions/committee.actions';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

type Props = {
  committeeName: string;
  userId: string;
};

export function ApproveMemberBtn({ committeeName, userId }: Props) {
  const router = useRouter();
  const { execute, isPending } = useAction(approveMember, {
    onSuccess: () => {
      toast.success('Member approved');
      router.refresh();
    },
    onError: ({ error }) =>
      toast.error(
        error?.validationErrors?.formErrors?.[0] ??
          error?.serverError ??
          error.thrownError?.message ??
          'Could not process request'
      ),
  });

  function handleClick() {
    execute({
      committee_name: committeeName,
      member_id: userId,
    });
  }
  return (
    <Button isLoading={isPending} onClick={handleClick} size={'sm'}>
      Approve
    </Button>
  );
}
