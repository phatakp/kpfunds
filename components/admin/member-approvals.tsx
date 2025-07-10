import { ApproveMemberBtn } from '@/components/committee/approve-member-btn';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllPendingApprovals } from '@/server/actions/committee.actions';

export async function MemberApprovals() {
  const { data: approvals } = await getAllPendingApprovals();

  if (!approvals) return;

  const data = approvals.map((mem) => ({
    name: mem.user.name,
    flat: `${mem.user.building}${mem.user.flat}`,
    committeeName: mem.committee_name,
    userId: mem.user.id,
  }));

  return (
    <Table>
      <TableCaption>A list of your pending approvals</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Flat</TableHead>
          <TableHead>Committee</TableHead>
          <TableHead>Approve</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((d, i) => (
          <TableRow key={`${d.name}${i}`}>
            <TableCell className="font-medium">{d.name}</TableCell>
            <TableCell>{d.flat}</TableCell>
            <TableCell>{d.committeeName}</TableCell>
            <TableCell>
              <ApproveMemberBtn
                committeeName={d.committeeName}
                userId={d.userId}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
