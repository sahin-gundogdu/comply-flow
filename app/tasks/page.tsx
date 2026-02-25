"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { TasksTable } from "@/components/tasks/TasksTable";
import { fetchTasks } from "@/lib/api";
import { Task } from "@/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error("Tasks fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Görevler Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Görevler</h1>
      </div>
      
      <div className="w-full">
        <TasksTable data={tasks} />
      </div>
    </div>
  );
}
