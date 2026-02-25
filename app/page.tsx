"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentTasksTable } from "@/components/dashboard/RecentTasksTable";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCreationDialog } from "@/components/tasks/TaskCreationDialog";
import { fetchDashboardSummary } from "@/lib/api";
import { DashboardSummaryDto } from "@/types";

export default function Home() {
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Gösterge paneli yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gösterge Paneli</h1>
        {/* Placeholder for Task Creation Dialog Trigger */}
        <TaskCreationDialog />
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Son Görevler</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTasksTable tasks={summary?.recentTasks} />
          </CardContent>
        </Card>

        {/* StatusChart now handles its own Card container to prevent double borders */}
        <StatusChart className="col-span-1" summary={summary} />
      </div>
    </div>
  );
}
