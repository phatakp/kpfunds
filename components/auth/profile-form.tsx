/** biome-ignore-all assist/source/organizeImports: <no> */
'use client';

import { ProfileCreateSchema } from '@/app/schemas';
import { TextInput } from '@/components/inputs/text-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { BUILDINGS } from '@/lib/constants';
import { cn, customResolver } from '@/lib/utils';
import { createProfile } from '@/server/actions/auth.actions';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import type { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SelectInput } from '../inputs/select-input';
import { useModal } from '../layouts/modal';

export function ProfileForm({ user }: { user: User | null }) {
  const queryClient = useQueryClient();
  const { modalId, closeModal } = useModal();
  const router = useRouter();

  const name = user?.user_metadata?.full_name ?? '';
  const image = user?.user_metadata?.avatar_url;

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(createProfile, customResolver(ProfileCreateSchema), {
      formProps: {
        mode: 'onChange',
        defaultValues: {
          email: user?.email,
          id: user?.id,
          name,
          building: 'A',
          flat: 0,
          image,
        },
      },
      actionProps: {
        onSuccess: () => {
          queryClient.invalidateQueries();
          toast.success('Profile Updated Successfully');
          resetFormAndAction();
          closeModal(modalId);
          router.push('/');
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
          <TextInput
            disabled={!!name}
            label="Name"
            register={form.register('name')}
          />
          <SelectInput
            label="Building"
            options={buildingOptions}
            register={form.register('building')}
          />
          <TextInput label="Flat" register={form.register('flat')} />

          <Button
            className="w-full"
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

const buildingOptions = BUILDINGS.map((b) => ({ label: b, value: b }));
