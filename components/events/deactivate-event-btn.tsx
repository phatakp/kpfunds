'use client';

import { Button } from '@/components/ui/button';
import { deActivateEvent } from '@/server/actions/event.actions';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Props = {
  slug: string;
};

export function DeActivateEventBtn({ slug }: Props) {
  const router = useRouter();

  const { execute, isPending } = useAction(deActivateEvent, {
    onSuccess: () => {
      toast.success('Event Deactivated');
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
    <Button
      isLoading={isPending}
      onClick={handleClick}
      size={'sm'}
      variant={'destructive'}
    >
      De-Activate
    </Button>
  );
}
