import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DashboardSummaryDto, Task } from "@/types";

interface RecentTasksTableProps {
  tasks: DashboardSummaryDto["recentTasks"] | undefined;
}

export function RecentTasksTable({ tasks = [] }: RecentTasksTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Başlık</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Öncelik</TableHead>
            <TableHead>Atanan</TableHead>
            <TableHead className="text-right">Son Tarih</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task: Task) => {
            const assigneeName = task.assignedToUser?.fullName || task.assignedToGroup?.name || "Atanmadı";
            const deadlineDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-";

            return (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      task.status === "Tamamlandı"
                        ? "default"
                        : task.status === "Gecikmiş"
                        ? "destructive"
                        : task.status === "İşlemde" || task.status === "Devam Ediyor" ? "secondary" : "outline"
                    }
                  >
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{assigneeName}</TableCell>
                <TableCell className="text-right">{deadlineDate}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
