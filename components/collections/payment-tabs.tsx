import type { TEventType } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BuildingTabs } from './building-tabs';

type Props = {
  type: TEventType;
};

export function PaymentTabs({ type }: Props) {
  return (
    <Tabs className="w-[400px] sm:w-full" defaultValue="collections">
      <TabsList>
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      <TabsContent value="collections">
        <div className="mt-4 grid gap-2">
          Choose the building
          <BuildingTabs type={type} />
        </div>
      </TabsContent>
      <TabsContent value="payments">Change your password here.</TabsContent>
    </Tabs>
  );
}
