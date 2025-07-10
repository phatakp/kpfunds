'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end px-4">
        <Input
          className="max-w-sm"
          onChange={(event) =>
            table.getColumn('donor_name')?.setFilterValue(event.target.value)
          }
          placeholder="Filter by Donor"
          value={
            (table.getColumn('donor_name')?.getFilterValue() as string) ?? ''
          }
        />
      </div>
      <div className="flex items-center justify-end px-4">
        <Input
          className="max-w-sm"
          onChange={(event) =>
            table.getColumn('receiver_name')?.setFilterValue(event.target.value)
          }
          placeholder="Filter by Receiver"
          value={
            (table.getColumn('receiver_name')?.getFilterValue() as string) ?? ''
          }
        />
      </div>
      <div className="border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center gap-2 py-4">
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size="icon"
          variant="ghost"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
