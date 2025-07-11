import type { TBuilding, TEventType } from '@/app/types';
import { amountFormatter } from '@/lib/utils';
import { getAllCollectionsbyBuilding } from '@/server/actions/collection.actions';
import { IndianRupee, Plus } from 'lucide-react';
import { Modal } from '../layouts/modal';
import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { columns } from './columns';
import { DataTable } from './data-table';

type Props = {
  building: TBuilding;
  type: TEventType;
};

export async function Collections({ building, type }: Props) {
  const { data: collections } = await getAllCollectionsbyBuilding({
    building,
    type,
  });
  const total = collections?.reduce((acc, b) => acc + b.amount, 0) ?? 0;

  return (
    <div className="w-full *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-secondary/20 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="max-w-sm sm:max-w-md md:max-w-full ">
        <CardHeader>
          <CardDescription>
            Total Collection for {building} building
          </CardDescription>
          <CardTitle>
            <div className="flex items-center">
              <IndianRupee className="size-4 text-muted-foreground" />
              <span className="font-semibold text-2xl">
                {amountFormatter(total)}
              </span>
            </div>
          </CardTitle>
          <CardAction>
            <Modal content={'New Entry'} title="Add New Entry">
              <Button className="rounded-md" size={'sm'}>
                <Plus />
                <span className="hidden sm:flex">New Entry</span>
              </Button>
            </Modal>
          </CardAction>
        </CardHeader>

        <CardContent className="p-0">
          <DataTable columns={columns} data={collections ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
