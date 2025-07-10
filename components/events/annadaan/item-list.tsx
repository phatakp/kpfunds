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
import { IndianRupee, IndianRupeeIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { BookingFormSchema } from '@/app/schemas';
import type { TItemWithBookings } from '@/app/types';
import { useAuthContext } from '@/components/auth/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import {
  createBookings,
  getAllAnnadaanItems,
} from '@/server/actions/annadaan.actions';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AnnadaanBookingForm } from './booking-form';
import { AnnadaanItem } from './item';
import { AnnadaanItemForm } from './item-form';

type Props = {
  year: number;
  isEventActive: boolean;
};

export function AnnadaanList({ year, isEventActive }: Props) {
  const { data: items, isLoading } = useQuery({
    queryKey: ['annadaan', year],
    queryFn: () => getAllAnnadaanItems({ year }).then((res) => res?.data),
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const { profile, isLoading: isAuthLoading } = useAuthContext();
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
            queryClient.invalidateQueries({ queryKey: ['annadaan', year] });
            toast.success('Items booked successfully');
            resetFormAndAction();
          }
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

  if (isLoading) return <ItemsLoader />;
  if (!items) return;

  const totalRequired = items.reduce((acc, b) => acc + b.amount, 0);
  const bookings = items.sort((a, b) => sortCriteria(a, b));
  const totalBookings = items.reduce(
    (acc, i) =>
      acc + i.bookings.reduce((bcc, b) => bcc + b.booked_qty * i.price, 0),
    0
  );

  return (
    <Form {...form}>
      <form
        className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card"
        onSubmit={handleSubmitWithAction}
      >
        <Card className="max-w-sm sm:max-w-md md:max-w-full">
          <CardHeader>
            <CardDescription>Total Bookings so far</CardDescription>
            <CardTitle>
              <div className="flex items-center">
                <IndianRupee className="size-4 text-muted-foreground" />
                <span className="font-semibold text-2xl">
                  {amountFormatter(totalBookings)}
                </span>
              </div>
            </CardTitle>
            {isAuthLoading && <Skeleton className="h-10 w-32" />}
            {!isAuthLoading && isUserAdmin && (
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
            {!form.formState.isSubmitSuccessful && <AnnadaanBookingForm />}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell colSpan={4}>
                    Total Required: ({bookings.length} items)
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <IndianRupeeIcon className="size-3.5 text-muted-foreground" />
                    {amountFormatter(totalRequired)}
                  </TableCell>
                </TableRow>
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

function ItemsLoader() {
  return (
    <div className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="max-w-sm sm:max-w-md md:max-w-full">
        <CardHeader>
          <CardTitle>Items List</CardTitle>
          <CardDescription>Donate generously for Annadaan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-fit md:w-[100px]">Item</TableHead>
                <TableHead className="text-right">Available Qty</TableHead>
                <TableHead className="text-right">Required</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...new Array(10).keys()].map((item) => (
                <TableRow key={item}>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
