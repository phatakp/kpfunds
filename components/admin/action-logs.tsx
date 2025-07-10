import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getISTDate } from '@/lib/utils';
import { getLogs } from '@/server/actions/log.actions';
import { format } from 'date-fns';

export async function ActionLogs() {
  const { data } = await getLogs();

  if (!data) return;

  return (
    <Table>
      <TableCaption>A list of recent actions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Action</TableHead>
          <TableHead>Actioned By</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((d) => (
          <TableRow key={d.created_at}>
            <TableCell className="font-medium">{d.text}</TableCell>
            <TableCell>{d.profile.name}</TableCell>
            <TableCell>{format(getISTDate(d.created_at), 'PPpp')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
