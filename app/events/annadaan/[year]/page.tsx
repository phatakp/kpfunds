import type { TEventType } from '@/app/types';
import { AnnadaanList } from '@/components/events/annadaan/item-list';
import { SelectEventYear } from '@/components/events/select-event-year';
import { Badge } from '@/components/ui/badge';
import { getAllEventsByType } from '@/server/actions/event.actions';

type PageProps = {
  params: Promise<{ year: number }>;
};

export default async function AnnadaanPage({ params }: PageProps) {
  const { year } = await params;
  const { data: events } = await getAllEventsByType({ type: 'annadaan' });
  if (!events) return;

  const isActive = events.find(
    (e) => e.type === ('annadaan' as TEventType) && e.year === Number(year)
  )?.is_active;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl">Annadaan - {year}</h1>
      {!isActive && <Badge>Event is not active</Badge>}
      <SelectEventYear events={events} type="annadaan" year={year} />
      <AnnadaanList isEventActive={!!isActive} year={year} />
    </div>
  );
}
