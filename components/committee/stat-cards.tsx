import type { TMemberWithProfile } from '@/app/types';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { amountFormatter, cn } from '@/lib/utils';
import { isLoggedInProfile } from '@/server/actions/auth.actions';
import {
  getAllCommitteeMembers,
  getAllCommittees,
  getCommitteeMember,
} from '@/server/actions/committee.actions';
import { Edit, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '../layouts/modal';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { CommitteeUpdateForm } from './committee-update-form';
import { JoinCommitteeBtn } from './join-committee-btn';

export async function CommitteeStatCards() {
  const { data } = await isLoggedInProfile();
  const { data: committees } = await getAllCommittees();

  if (!committees) return;

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-secondary/20 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-2 dark:*:data-[slot=card]:bg-card">
      {committees.map(async (comm) => {
        let member: TMemberWithProfile | undefined | null = null;
        const { data: members } = await getAllCommitteeMembers({
          commmitteeName: comm.name,
        });
        if (data?.user?.id) {
          const { data: mem } = await getCommitteeMember({
            committee_name: comm.name,
            member_id: data.user.id,
          });
          member = mem;
        }
        return (
          <Card className="@container/card" key={comm.name}>
            <CardHeader>
              <CardDescription>{comm.name}</CardDescription>
              <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
                <div className="flex items-center">
                  <IndianRupee className="text-muted-foreground" />
                  <span>{amountFormatter(comm.balance)}</span>
                </div>
              </CardTitle>
              <CardAction className="flex flex-col">
                {data?.user?.id && !member && (
                  <JoinCommitteeBtn
                    committeeName={comm.name}
                    userId={data.user.id}
                  />
                )}
                {data?.user?.id && !!member && !member.is_active && (
                  <Badge variant={'destructive'}>
                    Membership Approval Pending
                  </Badge>
                )}
                {member?.is_active && (
                  <Badge variant={'default'}>You are a member</Badge>
                )}
                {data?.profile?.is_admin && (
                  <Modal
                    content={<CommitteeUpdateForm committee={comm} />}
                    title="Update Balance"
                  >
                    <Button size={'icon'} variant={'ghost'}>
                      <Edit />
                    </Button>
                  </Modal>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-xl">Committee Members</h3>
                <div className=" flex flex-wrap items-center gap-4">
                  {members?.map((m) => (
                    <Badge key={m.member_id} variant={'outline'}>
                      {m.user.name} ({m.user.building}
                      {m.user.flat})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full flex-col gap-4">
                <h3 className="font-semibold text-xl">Events</h3>
                <div className="flex flex-col gap-2">
                  {comm.name === 'Piccadilly Temple' ? (
                    <div className="flex items-center justify-between">
                      <span>Temple</span>
                      <Link
                        className={cn(buttonVariants({ variant: 'link' }))}
                        href={'/temple'}
                      >
                        Visit now
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Ganpati</span>
                        <Link
                          className={cn(buttonVariants({ variant: 'link' }))}
                          href={`/events/ganpati/${new Date().getFullYear()}`}
                        >
                          Visit now
                        </Link>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Annadaan</span>
                        <Link
                          className={cn(buttonVariants({ variant: 'link' }))}
                          href={`/events/annadaan/${new Date().getFullYear()}`}
                        >
                          Visit now
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
