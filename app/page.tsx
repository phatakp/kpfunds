import { CommitteeStatCards } from '@/components/committee/stat-cards';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<Loader className="m-auto animate-spin" />}>
        <CommitteeStatCards />
      </Suspense>
      <div className="mt-8 grid gap-4">
        <h1 className="font-semibold text-3xl">Upcoming events</h1>

        <ul className="space-y-6">
          <li>
            <Button asChild variant={'link'}>
              <Link href={`/events/annadaan/${new Date().getFullYear()}`}>
                Annadaan
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant={'link'}>
              <Link href={`/events/ganpati/${new Date().getFullYear()}`}>
                Ganpati
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
