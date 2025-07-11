import { PaymentTabs } from '@/components/collections/payment-tabs';
import { ReceiverTotals } from '@/components/collections/receiver-totals';
import Background from '@/components/layouts/background';
import { DefaultPage } from '@/components/layouts/default-page';
import { NotAuthenticated } from '@/components/layouts/not-authenticated';
import { NotMember } from '@/components/layouts/not-member';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { isLoggedInProfile } from '@/server/actions/auth.actions';
import { getCommitteeMember } from '@/server/actions/committee.actions';
import { Suspense } from 'react';

export default async function TemplePage() {
  const { data } = await isLoggedInProfile();
  if (!data?.profile?.id) return <NotAuthenticated />;

  const { data: member } = await getCommitteeMember({
    committee_name: 'Piccadilly Cultural',
    member_id: data.profile.id,
  });
  if (!member) return <NotMember userId={data.profile.id} />;

  if (!member?.is_active)
    return <DefaultPage message="Your membership request is pending" />;

  return (
    <Background>
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-4xl">Society Temple</h1>
        <Suspense fallback={<TabsLoader />}>
          <PaymentTabs type="temple" />
        </Suspense>
        <Suspense fallback={<ReceiverLoader />}>
          <ReceiverTotals type="temple" />
        </Suspense>
      </div>
    </Background>
  );
}

function TabsLoader() {
  return (
    <div className="flex items-center">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}

function ReceiverLoader() {
  return (
    <div className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="max-w-sm sm:max-w-md md:max-w-full">
        <CardHeader>
          <CardTitle>Total Collections by Individual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-fit md:w-[100px]">Name</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
