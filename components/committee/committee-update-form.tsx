'use client';

import { CommitteeSchema } from '@/app/schemas';
import type { TCommittee } from '@/app/types';
import { TextInput } from '@/components/inputs/text-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { updateCommitteeBal } from '@/server/actions/committee.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useModal } from '../layouts/modal';

type Props = {
  committee: TCommittee;
};

export function CommitteeUpdateForm({ committee }: Props) {
  const router = useRouter();
  const { modalId, closeModal } = useModal();

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(updateCommitteeBal, zodResolver(CommitteeSchema), {
      formProps: {
        mode: 'onChange',
        defaultValues: committee,
      },
      actionProps: {
        onSuccess: () => {
          toast.success('Balance updated sucessfully');
          resetFormAndAction();
          closeModal(modalId);
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(
            error?.validationErrors?.formErrors?.[0] ??
              error?.serverError ??
              error.thrownError?.message ??
              'Could not process request'
          );
        },
      },
    });

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6')}
        onSubmit={handleSubmitWithAction}
      >
        <div className="grid gap-6">
          <TextInput disabled label="Name" register={form.register('name')} />
          <TextInput
            label="Balance"
            register={form.register('balance')}
            type="number"
          />

          <Button
            className="w-full"
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
