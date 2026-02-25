import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CircleDashed, Clock, AlertCircle } from "lucide-react";
import { DashboardSummaryDto } from "@/types";

interface SummaryCardsProps {
  summary: DashboardSummaryDto | null;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const summaries = [
    {
      title: "Toplam Görev",
      value: summary?.totalTasks?.toString() || "0",
      icon: CircleDashed,
      description: "Toplam mevcut kayıtlı görev",
      className: "text-blue-600",
    },
    {
      title: "Bekleyen Görevler",
      value: summary?.pendingTasks?.toString() || "0",
      icon: Clock,
      description: "Başlamayı bekleyenler",
      className: "text-yellow-600",
    },
    {
      title: "İşlemde",
      value: summary?.inProgressTasks?.toString() || "0",
      icon: Clock,
      description: "Devam eden işlemler",
      className: "text-blue-500",
    },
    {
      title: "Tamamlanan",
      value: summary?.completedTasks?.toString() || "0",
      icon: CheckCircle2,
      description: "Başarıyla bitirilenler",
      className: "text-green-600",
    },
    {
      title: "Gecikmiş",
      value: summary?.overdueTasks?.toString() || "0",
      icon: AlertCircle,
      description: "Acil dikkat gerekli!",
      className: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {summaries.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${item.className}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
