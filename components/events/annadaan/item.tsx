/** biome-ignore-all lint/complexity/noUselessFragments: <collapsible table shadcn> */
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { TableCell, TableRow } from '@/components/ui/table';
import { amountFormatter, cn } from '@/lib/utils';

import type { BookingFormSchema } from '@/app/schemas';
import type { TItemWithBookings, TUserProfile } from '@/app/types';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { ChevronDown, Dot, IndianRupeeIcon, Pen, X } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { z } from 'zod/v4';
import { Modal } from '../../layouts/modal';
import { Button } from '../../ui/button';
import { BookingDetails } from './booking-details';
import { AnnadaanItemForm } from './item-form';

type Props = {
  item: TItemWithBookings;
  isActive: boolean;
  profile: TUserProfile | undefined | null;
  year: number;
};

export function AnnadaanItem({ item, isActive, profile, year }: Props) {
  const { control, watch } =
    useFormContext<z.infer<typeof BookingFormSchema>>();
  const { append, remove } = useFieldArray({
    control,
    name: 'bookings',
  });
  const books = watch('bookings');

  const availableQty =
    item.quantity -
    (item.bookings?.reduce((acc, b) => acc + b.booked_qty, 0) ?? 0);
  const isAvailable = availableQty > 0;

  const handleClick = (checked: CheckedState) => {
    if (checked) {
      const idx = books.findIndex((b) => b.price === 0);

      if (idx !== -1) remove(idx);
      append({
        price: item.price,
        itemName: item.item_name,
        bookQty: availableQty,
        totQty: item.quantity,
      });
    } else remove(books.findIndex((b) => b.itemName === item.item_name));
  };

  return (
    <>
      <CollapsibleTrigger asChild>
        <TableRow
          className={cn(
            !isAvailable && 'cursor-pointer py-1 text-muted-foreground'
          )}
        >
          {isActive && profile?.is_admin && (
            <TableCell>
              <div className="flex items-center">
                <ActionIcon
                  handleClick={handleClick}
                  isAvailable={isAvailable}
                />
                <EditButton item={item} />
              </div>
            </TableCell>
          )}
          {!isActive && profile?.is_admin && (
            <TableCell>
              <EditButton item={item} />
            </TableCell>
          )}
          {isActive && !profile?.is_admin && (
            <TableCell>
              <ActionIcon handleClick={handleClick} isAvailable={isAvailable} />
            </TableCell>
          )}
          <TableCell className="font-medium">{item.item_name}</TableCell>
          <TableCell className="text-right">{availableQty}</TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end">
              <span>{item.quantity}</span>
              <span className="mx-1">{'x'}</span>
              <IndianRupeeIcon className="size-3.5 text-muted-foreground" />
              {amountFormatter(item.price)}
            </div>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end">
              <IndianRupeeIcon className="size-3.5 text-muted-foreground" />
              {amountFormatter(item.quantity * item.price)}
              {item?.bookings?.length ? (
                <ChevronDown className="size-3 text-muted-foreground" />
              ) : (
                <Dot className="size-3 text-muted-foreground" />
              )}
            </div>
          </TableCell>
        </TableRow>
      </CollapsibleTrigger>

      {item.bookings.length > 0 && (
        <CollapsibleContent asChild>
          <BookingDetails
            bookings={item.bookings}
            price={item.price}
            year={year}
          />
        </CollapsibleContent>
      )}
    </>
  );
}

const ActionIcon = ({
  isAvailable,
  handleClick,
}: {
  isAvailable: boolean;
  handleClick: (checked: CheckedState) => void;
}) => {
  if (isAvailable)
    return <Checkbox onCheckedChange={(checked) => handleClick(checked)} />;
  return <X className="size-5 translate-x-[3px] text-destructive" />;
};

const EditButton = ({ item }: { item: TItemWithBookings }) => {
  return (
    <Modal
      content={<AnnadaanItemForm item={item} />}
      title="Edit Annadaan Item"
    >
      <Button size={'icon'} variant={'ghost'}>
        <Pen className="size-4 text-muted-foreground" />
      </Button>
    </Modal>
  );
};
