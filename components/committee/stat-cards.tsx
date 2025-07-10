import type { TMemberWithProfile } from '@/app/types';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { amountFormatter } from '@/lib/utils';
import { isLoggedInProfile } from '@/server/actions/auth.actions';
import {
  getAllCommittees,
  getCommitteeMember,
} from '@/server/actions/committee.actions';
import { Edit, IndianRupee } from 'lucide-react';
import { Modal } from '../layouts/modal';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CommitteeUpdateForm } from './committee-update-form';
import { JoinCommitteeBtn } from './join-committee-btn';

export async function CommitteeStatCards() {
  const { data } = await isLoggedInProfile();
  const { data: committees } = await getAllCommittees();

  if (!committees) return;

  return (
    <div className="grid @md/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-secondary/20 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      {committees.map(async (comm) => {
        let member: TMemberWithProfile | undefined | null = null;
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
          </Card>
        );
      })}
    </div>
  );
}
