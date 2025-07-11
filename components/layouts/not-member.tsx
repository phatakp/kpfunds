import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { JoinCommitteeBtn } from '../committee/join-committee-btn';
import { Button } from '../ui/button';
import Background from './background';

export const NotMember = ({ userId }: { userId: string }) => {
  return (
    <Background>
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <AlertTriangle className="mx-auto h-24 w-24 text-muted-foreground" />

          <div className="space-y-2">
            <h1 className="font-bold text-4xl tracking-tight">
              You are not a member of this committee
            </h1>
          </div>

          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <JoinCommitteeBtn
              committeeName="Piccadilly Temple"
              userId={userId}
            />
            <Button asChild variant={'outline'}>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Background>
  );
};
