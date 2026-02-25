"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { fetchMyTasks, updateTaskStatus } from "@/lib/api";
import { Task } from "@/types";
import { Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type ColumnsType = {
  "Beklemede": Task[];
  "Devam Ediyor": Task[];
  "Tamamlandı": Task[];
  "Gecikmiş": Task[];
};

const COLUMNS: (keyof ColumnsType)[] = ["Beklemede", "Devam Ediyor", "Tamamlandı", "Gecikmiş"];

const COLUMN_COLORS = {
  "Beklemede": "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800",
  "Devam Ediyor": "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50",
  "Tamamlandı": "bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/50",
  "Gecikmiş": "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/50",
};

const HEADER_COLORS = {
  "Beklemede": "text-slate-600 dark:text-slate-400",
  "Devam Ediyor": "text-blue-600 dark:text-blue-400",
  "Tamamlandı": "text-green-600 dark:text-green-400",
  "Gecikmiş": "text-red-600 dark:text-red-400",
};

export default function KanbanPage() {
  const [columns, setColumns] = useState<ColumnsType>({
    "Beklemede": [],
    "Devam Ediyor": [],
    "Tamamlandı": [],
    "Gecikmiş": [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadTasks() {
      try {
        const tasks = await fetchMyTasks();
        
        const newColumns: ColumnsType = {
          "Beklemede": [],
          "Devam Ediyor": [],
          "Tamamlandı": [],
          "Gecikmiş": [],
        };

        tasks.forEach(task => {
          if (newColumns[task.status as keyof ColumnsType]) {
             newColumns[task.status as keyof ColumnsType].push(task);
          } else {
             newColumns["Beklemede"].push(task);
          }
        });

        setColumns(newColumns);
      } catch (error) {
        console.error("Failed to fetch my tasks for kanban:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTasks();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumn = source.droppableId as keyof ColumnsType;
    const destColumn = destination.droppableId as keyof ColumnsType;

    const sourceItems = [...columns[sourceColumn]];
    const destItems = [...columns[destColumn]];
    
    const [movedTask] = sourceItems.splice(source.index, 1);
    movedTask.status = destColumn;

    if (sourceColumn === destColumn) {
      sourceItems.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [sourceColumn]: sourceItems,
      });
    } else {
      destItems.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [sourceColumn]: sourceItems,
        [destColumn]: destItems,
      });

      try {
        await updateTaskStatus(movedTask.id, destColumn);
      } catch (error) {
        toast({
          title: "Hata",
          description: "Görev durumu güncellenemedi.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Kanban Panosu Yükleniyor...</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "Yüksek": return "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "Orta": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Düşük": return "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Kanban Panom</h1>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-6 min-w-max pb-4">
            {COLUMNS.map((columnId) => (
              <div key={columnId} className="flex flex-col w-80 shrink-0">
                <div className={`mb-3 flex items-center justify-between font-semibold ${HEADER_COLORS[columnId]}`}>
                  <span className="flex items-center gap-2">
                    {columnId}
                  </span>
                  <Badge variant="outline" className={`font-mono bg-white dark:bg-slate-950`}>
                    {columns[columnId].length}
                  </Badge>
                </div>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 overflow-y-auto rounded-xl border p-3 transition-all duration-200 ${COLUMN_COLORS[columnId]} ${snapshot.isDraggingOver ? 'ring-2 ring-primary/40 bg-opacity-70 dark:bg-opacity-40' : ''}`}
                    >
                      <div className="flex flex-col gap-3 min-h-[150px]">
                        {columns[columnId].map((task, index) => (
                          <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white dark:bg-slate-950 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-grab active:cursor-grabbing hover:border-primary/40 ${snapshot.isDragging ? 'shadow-xl scale-105 ring-2 ring-primary border-transparent z-50' : ''}`}
                              >
                                <h4 className="font-medium text-sm text-foreground mb-3 leading-snug">{task.title}</h4>
                                <div className="flex items-center justify-between mt-auto">
                                  <Badge className={`text-[10px] px-2 py-0.5 border-0 font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </Badge>
                                  {task.dueDate && (
                                     <div className="flex items-center text-[11px] text-muted-foreground font-medium bg-slate-50 dark:bg-slate-900 rounded-md px-2 py-1">
                                       <Calendar className="mr-1.5 h-3 w-3" />
                                       {format(new Date(task.dueDate), "d MMM", { locale: tr })}
                                     </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
