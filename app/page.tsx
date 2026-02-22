import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentTasksTable } from "@/components/dashboard/RecentTasksTable";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCreationDialog } from "@/components/tasks/TaskCreationDialog";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gösterge Paneli</h1>
        {/* Placeholder for Task Creation Dialog Trigger */}
        <TaskCreationDialog />
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Son Görevler</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTasksTable />
          </CardContent>
        </Card>

        {/* StatusChart now handles its own Card container to prevent double borders */}
        <StatusChart className="col-span-1" />
      </div>
    </div>
  );
}
