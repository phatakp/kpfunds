import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllEvents } from '@/server/actions/event.actions';
import { ActivateEventBtn } from '../events/activate-event-btn';
import { DeActivateEventBtn } from '../events/deactivate-event-btn';

export async function EventList() {
  const { data: events } = await getAllEvents();

  if (!events) return;

  return (
    <Table>
      <TableCaption>A list of events</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Committee</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((d) => (
          <TableRow key={d.slug}>
            <TableCell className="font-medium">{d.name}</TableCell>
            <TableCell>{d.year}</TableCell>
            <TableCell>{d.committee_name}</TableCell>
            <TableCell>
              {d.is_active ? (
                <DeActivateEventBtn slug={d.slug} />
              ) : (
                <ActivateEventBtn slug={d.slug} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
