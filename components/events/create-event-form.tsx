'use client';
import { EventCreateSchema } from '@/app/schemas';
import { SelectInput } from '@/components/inputs/select-input';
import { TextInput } from '@/components/inputs/text-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EVENT_TYPES } from '@/lib/constants';
import { cn, customResolver } from '@/lib/utils';
import { getAllCommittees } from '@/server/actions/committee.actions';
import { createEvent } from '@/server/actions/event.actions';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import FormErrorArea from '../layouts/form-error-area';
import { useModal } from '../layouts/modal';

export function CreateEventForm() {
  const router = useRouter();
  const { data: committees, isLoading } = useQuery({
    queryKey: ['committees'],
    queryFn: () => getAllCommittees().then((res) => res?.data),
  });
  const { modalId, closeModal } = useModal();

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

  const commOptions = committees?.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  if (isLoading) return <Loader className="mx-auto animate-spin" />;

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
