'use client';

import type { BookingFormSchema } from '@/app/schemas';
import type { TBuilding, TUserProfile } from '@/app/types';
import { SelectInput } from '@/components/inputs/select-input';
import { TextInput } from '@/components/inputs/text-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BUILDINGS } from '@/lib/constants';
import { useOutsideClick } from '@/lib/hooks/use-outside-click';
import { amountFormatter, cn } from '@/lib/utils';
import { getAllCommitteeMembers } from '@/server/actions/committee.actions';
import { useQuery } from '@tanstack/react-query';
import { IndianRupeeIcon, Loader, PenIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { z } from 'zod/v4';

type Props = {
  profile: TUserProfile | null | undefined;
};

export function AnnadaanBookingForm({ profile }: Props) {
  const [editing, setEditing] = useState(-1);
  const { watch, register, setValue, formState } =
    useFormContext<z.infer<typeof BookingFormSchema>>();
  const [books, paidTo] = watch(['bookings', 'paidTo']);

  const { data: members, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () =>
      getAllCommitteeMembers({ commmitteeName: 'Piccadilly Cultural' }).then(
        (res) => res.data
      ),
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  useOutsideClick(inputRef, () => setEditing(-1));

  useEffect(() => {
    if (profile) {
      setValue('bookByName', profile.name);
      setValue('building', profile.building as TBuilding);
      setValue('flat', profile.flat as number);
    }
  }, [profile, setValue]);

  if (isLoading) return <Loader className="m-auto animate-spin" />;

  const memberOptions = (
    members
      ?.filter((m) => !!m?.profile?.name)
      .map((m) => ({
        label: `${m.profile.name} (${m.profile.building}${m.profile.flat})`,
        value: `${m.profile.name} (${m.profile.building}${m.profile.flat})`,
      })) ?? []
  ).concat({ label: 'Other', value: 'Other' });

  if (!books?.at(-1)?.bookQty) return;
  const totalBooked = books.reduce((acc, b) => acc + b.price * b.bookQty, 0);

  function onPaidToChanged(val: string) {
    if (val !== 'Other') setValue('receiver', val);
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Selected Items</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col space-y-4">
          {!profile && (
            <>
              <TextInput label="Name" register={register('bookByName')} />

              <div className="flex gap-4">
                <SelectInput
                  label="Building"
                  options={buildingOptions}
                  register={register('building')}
                />
                <TextInput
                  label="Flat"
                  register={register('flat')}
                  showClear={false}
                  type="number"
                />
              </div>
            </>
          )}
          <SelectInput
            handleChange={onPaidToChanged}
            label="Paid to"
            options={memberOptions}
            register={register('paidTo')}
          />
          {paidTo === 'Other' && (
            <TextInput label="Receiver" register={register('receiver')} />
          )}

          <Table>
            <TableCaption>
              <div className="flex w-full items-center justify-center">
                <span>Change the quantity if needed</span>
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead className="w-[100px] sm:w-full">Item</TableHead>
                <TableHead className={cn('text-right', editing && 'w-[100px]')}>
                  Qty
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((b, i) => (
                <TableRow key={b.itemName}>
                  <TableCell>
                    <Button
                      className="p-0"
                      onClick={() => setEditing(i)}
                      size={'icon'}
                      type="button"
                      variant={'ghost'}
                    >
                      <PenIcon className="size-3" />
                    </Button>
                  </TableCell>
                  <TableCell className="truncate font-medium">
                    <div className="flex items-center gap-3">
                      <span>{b.itemName}</span>
                      <div className="flex items-center">
                        <IndianRupeeIcon className="size-3 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">
                          {b.price}/item
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn('text-right', editing && 'w-[100px]')}
                  >
                    {editing === i ? (
                      <TextInput
                        className="w-[100px]"
                        label="Qty"
                        max={b.totQty}
                        min={0}
                        ref={inputRef}
                        register={register(`bookings.${i}.bookQty`, {
                          valueAsNumber: true,
                        })}
                        showClear={false}
                        step={0.5}
                        type="number"
                      />
                    ) : (
                      b.bookQty
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {amountFormatter(books[i].bookQty * b.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted text-muted-foreground">
                <TableCell colSpan={3}>Total Amount:</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <IndianRupeeIcon className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-lg">
                      {amountFormatter(totalBooked)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-end">
          <Button isLoading={formState.isSubmitting} type="submit">
            Book
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
const buildingOptions = BUILDINGS.map((b) => ({ label: b, value: b }));
