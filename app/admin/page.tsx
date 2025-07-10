import { ActionLogs } from '@/components/admin/action-logs';
import { EventList } from '@/components/admin/event-list';
import { MemberApprovals } from '@/components/admin/member-approvals';
import { CreateEventForm } from '@/components/events/create-event-form';
import { Modal } from '@/components/layouts/modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { isLoggedInProfile } from '@/server/actions/auth.actions';
import { Loader, Plus } from 'lucide-react';
import { Suspense } from 'react';

export default async function AdminPage() {
  const { data } = await isLoggedInProfile();

  if (!data?.profile?.is_admin)
    return (
      <div className="mx-auto font-semibold text-destructive">
        You are not authorized to view this page
      </div>
    );

  return (
    <div className="flex flex-col gap-12">
      <div className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="flex max-w-sm flex-col gap-4 sm:max-w-md md:max-w-full">
          <CardHeader>
            <CardTitle className="font-extrabold text-2xl">Events</CardTitle>
            <CardAction>
              <Modal content={<CreateEventForm />} title="Add Event">
                <Button className="rounded-sm" size={'icon'}>
                  <Plus />
                </Button>
              </Modal>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Loader className="m-auto animate-spin" />}>
              <EventList />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="flex max-w-sm flex-col gap-4 sm:max-w-md md:max-w-full">
          <CardHeader>
            <CardTitle className="font-extrabold text-2xl">
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Loader className="m-auto animate-spin" />}>
              <MemberApprovals />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="flex max-w-sm flex-col gap-4 sm:max-w-md md:max-w-full">
          <CardHeader>
            <CardTitle className="font-extrabold text-2xl">
              Action Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Loader className="m-auto animate-spin" />}>
              <ActionLogs />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
