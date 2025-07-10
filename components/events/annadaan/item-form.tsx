'use client';

import { AnnadaanItemSchema } from '@/app/schemas';
import type { TItemWithBookings } from '@/app/types';
import { TextInput } from '@/components/inputs/text-input';
import { useModal } from '@/components/layouts/modal';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { customResolver } from '@/lib/utils';
import { upsertAnnadaanItem } from '@/server/actions/annadaan.actions';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useQueryClient } from '@tanstack/react-query';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

type Props = {
  item?: TItemWithBookings;
};

export function AnnadaanItemForm({ item }: Props) {
  const queryClient = useQueryClient();
  const { modalId, closeModal } = useModal();

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(upsertAnnadaanItem, customResolver(AnnadaanItemSchema), {
      formProps: {
        mode: 'onChange',
        defaultValues: {
          item_name: item?.item_name ?? '',
          quantity: item?.quantity ?? 0,
          price: item?.price ?? 0,
          amount: item?.amount ?? 0,
        },
      },
      actionProps: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['annadaan'] });
          toast.success(`Item ${item ? 'updated' : 'created'} successfully`);
          closeModal(modalId);
          resetFormAndAction();
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

  const [price, quantity] = form.watch(['price', 'quantity']);

  useEffect(() => {
    if (price && quantity)
      form.setValue('amount', Number(price) * Number(quantity));
  }, [price, quantity, form.setValue]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmitWithAction}
      >
        <TextInput label="Name" register={form.register('item_name')} />

        <div className="flex gap-4">
          <TextInput
            label="Quantity"
            register={form.register('quantity')}
            showClear={false}
            type="number"
          />
          <TextInput
            label="Price"
            register={form.register('price')}
            showClear={false}
            type="number"
          />
        </div>
        <div className="flex justify-end">
          <Button isLoading={form.formState.isSubmitting} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
