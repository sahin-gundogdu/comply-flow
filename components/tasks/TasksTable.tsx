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
import { Task } from "@/types";
import { useRouter } from "next/navigation";
import { deleteTask } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TasksTableProps {
  data: Task[];
}

export function TasksTable({ data }: TasksTableProps) {
  const router = useRouter();
  const { toast } = useToast();

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

  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  
  const [taskToEdit, setTaskToEdit] = React.useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleDeleteConfirm = async () => {
      if (taskToDelete) {
          try {
              await deleteTask(taskToDelete.id);
              toast({
                  title: "Silindi",
                  description: "Görev başarıyla silindi.",
              });
              router.refresh();
          } catch (error) {
              console.error(error);
              toast({
                  variant: "destructive",
                  title: "Hata",
                  description: "Görev silinirken bir hata oluştu.",
              });
          } finally {
              setIsDeleteDialogOpen(false);
              setTaskToDelete(null);
          }
      }
  };

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
                status === "İşlemde" || status === "Devam Ediyor" ? "secondary" : "outline"
            }>
                {status}
            </Badge>
        )
      }
    },
    {
      id: "assignee",
      header: "Atanan",
      cell: ({ row }) => {
        const task = row.original;
        const assigneeName = task.assignedToUser?.fullName || task.assignedToGroup?.name || "Atanmadı";
        return <div>{assigneeName}</div>;
      },
    },
    {
      accessorKey: "dueDate",
      header: "Son Tarih",
      cell: ({ row }) => {
        const dueDateStr = row.getValue("dueDate") as string;
        const formattedDate = dueDateStr ? new Date(dueDateStr).toLocaleDateString() : "-";
        return <div>{formattedDate}</div>;
      },
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
                onClick={() => navigator.clipboard.writeText(task.id.toString())}
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
              <DropdownMenuItem onClick={() => {
                  setTaskToEdit(task);
                  setIsEditDialogOpen(true);
              }}>Düzenle</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => {
                  setTaskToDelete(task);
                  setIsDeleteDialogOpen(true);
              }}>Sil</DropdownMenuItem>
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
        <SheetContent className="sm:max-w-5xl overflow-y-auto">
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
                            description: selectedTask.description || "Bu görev için detaylı açıklama bulunmamaktadır.",
                            type: (selectedTask.type as any) || "Diğer",
                            priority: selectedTask.priority as any,
                            status: selectedTask.status as any,
                            deadline: selectedTask.dueDate ? new Date(selectedTask.dueDate) : new Date(),
                            assignmentType: selectedTask.assignedToGroupId ? "group" : "user",
                            assignedUser: selectedTask.assignedToUserId?.toString() || "",
                            assignedGroup: selectedTask.assignedToGroupId?.toString() || "",
                            subtasks: (selectedTask.subTasks || []).map(st => ({
                                title: st.title,
                                description: st.description || "",
                                dueDate: st.dueDate ? new Date(st.dueDate) : undefined,
                                assignmentType: st.assignedToUserId ? "user" : (st.assignedToGroupId ? "group" : "none"),
                                assignedUser: st.assignedToUserId?.toString() || "",
                                assignedGroup: st.assignedToGroupId?.toString() || ""
                            }))
                        }}
                    />
                )}
            </div>
        </SheetContent>
      </Sheet>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Görevi Düzenle</DialogTitle>
                <DialogDescription>
                    Mevcut görev bilgilerini güncelleyin.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                {taskToEdit && (
                    <TaskForm 
                        onClose={() => {
                            setIsEditDialogOpen(false);
                            setTaskToEdit(null);
                        }}
                        taskId={taskToEdit.id}
                        defaultValues={{
                            title: taskToEdit.title,
                            description: taskToEdit.description || "",
                            type: (taskToEdit.type as any) || "Proje",
                            priority: (taskToEdit.priority as any) || "Orta",
                            status: (taskToEdit.status as any) || "Beklemede",
                            deadline: taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : new Date(),
                            assignmentType: taskToEdit.assignedToGroupId ? "group" : "user",
                            assignedUser: taskToEdit.assignedToUserId?.toString() || "",
                            assignedGroup: taskToEdit.assignedToGroupId?.toString() || "",
                            subtasks: (taskToEdit.subTasks || []).map(st => ({
                                title: st.title,
                                description: st.description || "",
                                dueDate: st.dueDate ? new Date(st.dueDate) : undefined,
                                assignmentType: st.assignedToUserId ? "user" : (st.assignedToGroupId ? "group" : "none"),
                                assignedUser: st.assignedToUserId?.toString() || "",
                                assignedGroup: st.assignedToGroupId?.toString() || ""
                            }))
                        }}
                    />
                )}
            </div>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zorunlu Onay</AlertDialogTitle>
            <AlertDialogDescription>
              Bu görevi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
