'use client';
import { EventCreateSchema } from '@/app/schemas';
import type { TCommittee } from '@/app/types';
import { SelectInput } from '@/components/inputs/select-input';
import { TextInput } from '@/components/inputs/text-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EVENT_TYPES } from '@/lib/constants';
import { cn, customResolver } from '@/lib/utils';
import { createEvent } from '@/server/actions/event.actions';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import FormErrorArea from '../layouts/form-error-area';
import { useModal } from '../layouts/modal';

type Props = {
  committees: TCommittee[] | null | undefined;
};
export function CreateEventForm({ committees }: Props) {
  const router = useRouter();
  const { modalId, closeModal } = useModal();
  const commOptions = committees?.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(createEvent, customResolver(EventCreateSchema), {
      formProps: {
        mode: 'onChange',
        defaultValues: {
          name: '',
          year: new Date().getFullYear(),
        },
      },
      actionProps: {
        onSuccess: () => {
          toast.success('Event Created Successfully');
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
      <FormErrorArea />
      <form
        className={cn('flex flex-col gap-6')}
        onSubmit={handleSubmitWithAction}
      >
        <TextInput label="Name" register={form.register('name')} />
        <SelectInput
          label="Committee"
          options={commOptions ?? []}
          register={form.register('committee_name')}
        />
        <SelectInput
          label="Event"
          options={typeOptions}
          register={form.register('type')}
        />
        <TextInput
          label="Year"
          register={form.register('year')}
          type="number"
        />

        <Button
          className="w-full"
          isLoading={form.formState.isSubmitting}
          type="submit"
        >
          Save
        </Button>
      </form>
    </Form>
  );
}

const typeOptions = EVENT_TYPES.map((c) => ({ label: c, value: c }));
