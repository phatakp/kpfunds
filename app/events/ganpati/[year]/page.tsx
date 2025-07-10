import type { TEventType } from '@/app/types';
import { SelectEventYear } from '@/components/events/select-event-year';
import { getAllEventsByType } from '@/server/actions/event.actions';

type PageProps = {
  params: Promise<{ year: number }>;
};

export default async function GanpatiPage({ params }: PageProps) {
  const { year } = await params;
  const { data: events } = await getAllEventsByType({ type: 'ganpati' });

  if (!events) return;

  const isActive = events.find(
    (e) => e.type === ('ganpati' as TEventType) && e.year === Number(year)
  )?.is_active;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl">Ganpati - {year}</h1>
      <SelectEventYear events={events} type="ganpati" year={year} />
    </div>
  );
}
