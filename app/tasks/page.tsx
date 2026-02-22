import { Metadata } from "next";
import { TasksTable } from "@/components/tasks/TasksTable";

export const metadata: Metadata = {
  title: "Görevler | Hukuk & Uyumluluk",
  description: "Tüm hukuk ve uyumluluk görevlerini yönetin.",
};

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Görevler</h1>
      </div>
      
      <div className="w-full">
        <TasksTable />
      </div>
    </div>
  );
}
