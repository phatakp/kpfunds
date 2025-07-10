'use client';

import { Button } from '@/components/ui/button';
import { addMember } from '@/server/actions/committee.actions';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Props = {
  committeeName: string;
  userId: string;
};

export function JoinCommitteeBtn({ committeeName, userId }: Props) {
  const router = useRouter();

  const { execute, isPending } = useAction(addMember, {
    onSuccess: () => {
      toast.success('Membership Request Sent');
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
    <Button isLoading={isPending} onClick={handleClick}>
      Join Now
    </Button>
  );
}
