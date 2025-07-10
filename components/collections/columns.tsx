'use client';

import type { TCollection } from '@/app/types';
import { Modal } from '@/components/layouts/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { amountFormatter, cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown, IndianRupee, Pen, Trash2 } from 'lucide-react';

export const columns: ColumnDef<TCollection>[] = [
  {
    id: 'select',
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          className="my-auto"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'donor_name',
    header: ({ column, table }) => {
      const currentSorting = table.getState().sorting;
      const isColumnSorted = currentSorting.some(
        (sort) => sort.id === 'donor_name'
      );
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Donor Name
          <ChevronsUpDown
            className={cn(
              'size-4 text-muted-foreground',
              isColumnSorted && 'text-foreground'
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3 capitalize">{row.getValue('donor_name')}</div>
    ),
  },
  {
    accessorKey: 'donor_flat',
    header: ({ column, table }) => {
      const currentSorting = table.getState().sorting;
      const isColumnSorted = currentSorting.some(
        (sort) => sort.id === 'donor_flat'
      );
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Flat
          <ChevronsUpDown
            className={cn(
              'size-4 text-muted-foreground',
              isColumnSorted && 'text-foreground'
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-3">{row.getValue('donor_flat')}</div>,
  },
  {
    accessorKey: 'amount',
    header: ({ column, table }) => {
      const currentSorting = table.getState().sorting;
      const isColumnSorted = currentSorting.some(
        (sort) => sort.id === 'amount'
      );
      return (
        <div className="flex items-center justify-end">
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            variant="ghost"
          >
            Amount
            <ChevronsUpDown
              className={cn(
                'size-4 text-muted-foreground',
                isColumnSorted && 'text-foreground'
              )}
            />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-end pr-3 text-right font-medium">
        <IndianRupee className="size-3.5 text-muted-foreground" />
        {amountFormatter(row.getValue('amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'payment_type',
    header: () => <div className="text-center">Mode</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge
          className="capitalize"
          variant={
            row.getValue('payment_type') === 'cash' ? 'destructive' : 'default'
          }
        >
          {row.getValue('payment_type')}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'receiver_name',
    header: ({ column, table }) => {
      const currentSorting = table.getState().sorting;
      const isColumnSorted = currentSorting.some(
        (sort) => sort.id === 'receiver_name'
      );
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant="ghost"
        >
          Paid To
          <ChevronsUpDown
            className={cn(
              'size-4 text-muted-foreground',
              isColumnSorted && 'text-foreground'
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-3 capitalize">{row.getValue('receiver_name')}</div>
    ),
  },
  {
    id: 'action',
    cell: ({ row }) => (
      <div
        className={cn(
          'flex items-center gap-2',
          !row.getIsSelected() && 'hidden'
        )}
      >
        <Modal content={'Edit'} title="Edit Collection Entry">
          <Button className="p-0" size={'icon'} variant={'ghost'}>
            <Pen className="size-4 text-muted-foreground" />
          </Button>
        </Modal>
        <Button className="p-0" size={'icon'} variant={'ghost'}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
