"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { TaskForm } from "./TaskForm";
import { TaskCreationDialog } from "./TaskCreationDialog";

// Mock Data
const data: Task[] = [
  {
    id: "TASK-1024",
    title: "3. Çeyrek tedarikçi sözleşmesi incelemesi",
    type: "Sözleşme",
    priority: "Yüksek",
    status: "İşlemde",
    assignee: "Alice Smith",
    deadline: "2024-03-15",
    group: "Uyum",
  },
  {
    id: "TASK-1025",
    title: "KVKK uyumluluk politikası güncellemesi",
    type: "KVKK",
    priority: "Orta",
    status: "Beklemede",
    assignee: "Hukuk Ekibi",
    deadline: "2024-03-20",
    group: "KVKK",
  },
  {
    id: "TASK-1026",
    title: "Çalışan el kitabı revizyonu",
    type: "Personel",
    priority: "Düşük",
    status: "Tamamlandı",
    assignee: "Bob Jones",
    deadline: "2024-02-28",
    group: "İnsan Kaynakları",
  },
  {
    id: "TASK-1027",
    title: "İç erişim kontrolleri denetimi",
    type: "Proje",
    priority: "Kritik",
    status: "Gecikmiş",
    assignee: "Güvenlik Grubu",
    deadline: "2024-03-01",
    group: "Uyum",
  },
  {
    id: "TASK-1028",
    title: "Yeni ortaklık için NDA taslağı",
    type: "Sözleşme",
    priority: "Orta",
    status: "İşlemde",
    assignee: "Alice Smith",
    deadline: "2024-03-18",
    group: "Hukuk",
  },
];

export type Task = {
  id: string;
  title: string;
  type: "Proje" | "Sözleşme" | "Personel" | "KVKK" | "Diğer";
  priority: "Düşük" | "Orta" | "Yüksek" | "Kritik";
  status: "Beklemede" | "İşlemde" | "Tamamlandı" | "Gecikmiş";
  assignee: string;
  deadline: string;
  group: string;
};

export function TasksTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Sheet state for viewing details
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="w-[80px] font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Başlık
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "type",
      header: "Tür",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    },
    {
      accessorKey: "priority",
      header: "Öncelik",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        let variant: "default" | "destructive" | "secondary" | "outline" = "outline";
        if (priority === "Kritik") variant = "destructive";
        if (priority === "Yüksek") variant = "destructive"; // Or a specific color class if customized
        if (priority === "Orta") variant = "secondary";
        if (priority === "Düşük") variant = "default"; // Greenish usually or default

        return (
          <Badge className={
            priority === "Kritik" ? "bg-red-900 hover:bg-red-800" :
            priority === "Yüksek" ? "bg-red-600 hover:bg-red-500" : 
            priority === "Orta" ? "bg-yellow-500 hover:bg-yellow-400" : 
            "bg-blue-500 hover:bg-blue-400"
          }>
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
            <Badge variant={
                status === "Tamamlandı" ? "default" :
                status === "Gecikmiş" ? "destructive" :
                status === "İşlemde" ? "secondary" : "outline"
            }>
                {status}
            </Badge>
        )
      }
    },
    {
      accessorKey: "assignee",
      header: "Atanan",
      cell: ({ row }) => <div>{row.getValue("assignee")}</div>,
    },
    {
      accessorKey: "deadline",
      header: "Son Tarih",
      cell: ({ row }) => <div>{row.getValue("deadline")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menüyü aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Eylemler</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(task.id)}
              >
                ID Kopyala
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                  setSelectedTask(task);
                  setIsSheetOpen(true);
              }}>
                <Eye className="mr-2 h-4 w-4"/> Detayları Gör
              </DropdownMenuItem>
              <DropdownMenuItem>Düzenle</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Sil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
            <Input
            placeholder="Başlık ara..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
            />
            
            {/* Status Filter */}
            <Select 
                value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}
            >
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Durum Filtrele" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="Beklemede">Beklemede</SelectItem>
                    <SelectItem value="İşlemde">İşlemde</SelectItem>
                    <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                    <SelectItem value="Gecikmiş">Gecikmiş</SelectItem>
                </SelectContent>
            </Select>

             {/* Priority Filter */}
             <Select 
                value={(table.getColumn("priority")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => table.getColumn("priority")?.setFilterValue(value === "all" ? "" : value)}
            >
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Öncelik Filtrele" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="Kritik">Kritik</SelectItem>
                    <SelectItem value="Yüksek">Yüksek</SelectItem>
                    <SelectItem value="Orta">Orta</SelectItem>
                    <SelectItem value="Düşük">Düşük</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
        <TaskCreationDialog />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} satır seçildi.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
          </Button>
        </div>
      </div>

      {/* View Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
            <SheetHeader>
                <SheetTitle>Görev Detayları</SheetTitle>
                <SheetDescription>
                   {selectedTask?.id} numaralı görevin detaylarını görüntülüyorsunuz.
                </SheetDescription>
            </SheetHeader>
            <div className="py-4">
                {/* Reusing TaskForm in Read-Only Mode */}
                {selectedTask && (
                    <TaskForm 
                        readOnly={true} 
                        onClose={() => setIsSheetOpen(false)}
                        defaultValues={{
                            title: selectedTask.title,
                            description: "Bu mock veri olduğu için detaylı açıklama bulunmamaktadır.",
                            type: selectedTask.type,
                            priority: selectedTask.priority,
                            status: selectedTask.status,
                            deadline: new Date(selectedTask.deadline),
                            assignmentType: "user", // Mock assumption
                            assignedUser: selectedTask.assignee,
                            subtasks: []
                        }}
                    />
                )}
            </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
