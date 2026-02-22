import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tasks = [
  {
    id: "TASK-1024",
    title: "3. Çeyrek tedarikçi sözleşmesi incelemesi",
    status: "İşlemde",
    priority: "Yüksek",
    assignee: "Alice Smith",
    deadline: "2024-03-15",
  },
  {
    id: "TASK-1025",
    title: "KVKK uyumluluk politikası güncellemesi",
    status: "Beklemede",
    priority: "Orta",
    assignee: "Hukuk Ekibi",
    deadline: "2024-03-20",
  },
  {
    id: "TASK-1026",
    title: "Çalışan el kitabı revizyonu",
    status: "Tamamlandı",
    priority: "Düşük",
    assignee: "Bob Jones",
    deadline: "2024-02-28",
  },
  {
    id: "TASK-1027",
    title: "İç erişim kontrolleri denetimi",
    status: "Gecikmiş",
    priority: "Yüksek",
    assignee: "Güvenlik Grubu",
    deadline: "2024-03-01",
  },
  {
    id: "TASK-1028",
    title: "Yeni ortaklık için NDA taslağı",
    status: "İşlemde",
    priority: "Orta",
    assignee: "Alice Smith",
    deadline: "2024-03-18",
  },
];

export function RecentTasksTable() {
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
          {tasks.map((task) => (
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
                      : "secondary"
                  }
                >
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell className="text-right">{task.deadline}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
