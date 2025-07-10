'use client';
import { Modal } from '@/components/layouts/modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { Form } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { amountFormatter, customResolver } from '@/lib/utils';
import { IndianRupeeIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { BookingFormSchema } from '@/app/schemas';
import type { TItemWithBookings } from '@/app/types';
import { useAuthContext } from '@/components/auth/auth-provider';
import { createBookings } from '@/server/actions/annadaan.actions';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import toast from 'react-hot-toast';
import { AnnadaanBookingForm } from './booking-form';
import { AnnadaanItem } from './item';
import { AnnadaanItemForm } from './item-form';

type Props = {
  year: number;
  items: TItemWithBookings[] | undefined;
  isEventActive: boolean;
};

export function AnnadaanList({ year, items, isEventActive }: Props) {
  console.log({ isEventActive });

  const router = useRouter();
  const { profile } = useAuthContext();
  const isUserAdmin = !!profile?.is_admin;

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(createBookings, customResolver(BookingFormSchema), {
      formProps: {
        mode: 'onChange',
        defaultValues: {
          bookByName: '',
          receiver: '',
          building: 'A',
          flat: 0,
          year,
          bookings: [
            {
              itemName: '',
              totQty: 0,
              bookQty: 0,
              price: 0,
            },
          ],
        },
      },
      actionProps: {
        onSuccess: ({ data }) => {
          if (data) toast.error(data);
          else {
            toast.success('Items booked successfully');
            resetFormAndAction();
          }
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(
            error?.validationErrors?.formErrors?.[0] ??
              error?.serverError ??
              error.thrownError?.message ??
              'Could not process request'
          );
          router.refresh();
        },
      },
    });

  if (!items) return;

  const totalRequired = items.reduce((acc, b) => acc + b.amount, 0);
  const bookings = items.sort((a, b) => sortCriteria(a, b));

  return (
    <Form {...form}>
      <form
        className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card"
        onSubmit={handleSubmitWithAction}
      >
        <Card className="max-w-sm sm:max-w-md md:max-w-full">
          <CardHeader>
            <CardTitle>Items List</CardTitle>
            <CardDescription>Donate generously for Annadaan</CardDescription>
            {isUserAdmin && (
              <CardAction>
                <Modal content={<AnnadaanItemForm />} title="Add Annadaan Item">
                  <Button className="rounded-md" size={'sm'}>
                    <Plus />
                    <span className="hidden sm:flex">New Item</span>
                  </Button>
                </Modal>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {!form.formState.isSubmitSuccessful && (
              <AnnadaanBookingForm profile={profile} />
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  {(isEventActive || isUserAdmin) && <TableHead>Sel</TableHead>}
                  <TableHead className="w-fit md:w-[100px]">Item</TableHead>
                  <TableHead className="text-right">Available Qty</TableHead>
                  <TableHead className="text-right">Required</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.map((item) => (
                  <Collapsible asChild key={item.item_name}>
                    <AnnadaanItem
                      isActive={isEventActive}
                      item={item}
                      profile={profile}
                      year={year}
                    />
                  </Collapsible>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    Total ({bookings.length} items)
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <IndianRupeeIcon className="size-3.5 text-muted-foreground" />
                    {amountFormatter(totalRequired)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

function sortCriteria(a: TItemWithBookings, b: TItemWithBookings) {
  const t1 =
    a.quantity > (a?.bookings?.reduce((acc, b) => acc + b.booked_qty, 0) ?? 0)
      ? 1
      : 0;
  const t2 =
    b.quantity > (b?.bookings?.reduce((acc, b) => acc + b.booked_qty, 0) ?? 0)
      ? 1
      : 0;
  if (t1 === t2) return b.price * b.quantity < a.price * a.quantity ? -1 : 1;
  return t1 > t2 ? -1 : 1;
}
