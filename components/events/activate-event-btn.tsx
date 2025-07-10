'use client';

import { Button } from '@/components/ui/button';
import { activateEvent } from '@/server/actions/event.actions';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Props = {
  slug: string;
};

export function ActivateEventBtn({ slug }: Props) {
  const router = useRouter();

  const { execute, isPending } = useAction(activateEvent, {
    onSuccess: () => {
      toast.success('Event Activated');
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
    execute({ slug });
  }

  return (
    <Button isLoading={isPending} onClick={handleClick} size={'sm'}>
      Activate
    </Button>
  );
}
