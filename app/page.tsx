import { CommitteeStatCards } from '@/components/committee/stat-cards';
import Background from '@/components/layouts/background';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Background className="items-start justify-start">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-4xl">Committees</h1>
        <Badge>Only Members have all viewing rights</Badge>
        <Suspense fallback={<CommitteeLoader />}>
          <CommitteeStatCards />
        </Suspense>
      </div>
    </Background>
  );
}

function CommitteeLoader() {
  return (
    <div className="grid @md/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-secondary/20 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card h-32 w-full">
        <CardContent>
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
      <Card className="@container/card h-32 w-full">
        <CardContent>
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
