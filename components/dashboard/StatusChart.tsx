import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardSummaryDto } from "@/types";

interface StatusChartProps {
  className?: string;
  summary: DashboardSummaryDto | null;
}

export function StatusChart({ className, summary }: StatusChartProps) {
  // Data for the chart mapped from live endpoints
  const data = [
    { name: "Tamamlandı", value: summary?.completedTasks || 0, color: "text-green-500", stroke: "#22c55e" },
    { name: "İşlemde", value: summary?.inProgressTasks || 0, color: "text-blue-500", stroke: "#3b82f6" },
    { name: "Beklemede", value: summary?.pendingTasks || 0, color: "text-yellow-500", stroke: "#eab308" },
    { name: "Gecikmiş", value: summary?.overdueTasks || 0, color: "text-red-500", stroke: "#ef4444" },
  ];

  // Calculate total for percentages
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // SVG parameters
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  let currentOffset = 0;

  return (
    <Card className={cn("h-full shadow-sm", className)}>
      <CardHeader>
        <CardTitle>Görev Durumu Dağılımı</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-6">
        {/* Donut Chart */}
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90 transform">
                {data.map((item, index) => {
                    const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
                    const strokeDashoffset = -currentOffset;
                    currentOffset += (item.value / total) * circumference;

                    return (
                        <circle
                            key={item.name}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke={item.stroke}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-500 ease-out hover:opacity-80"
                        />
                    );
                })}
            </svg>
            <div className="absolute flex flex-col items-center">
                 <span className="text-3xl font-bold">{total}</span>
                 <span className="text-xs text-muted-foreground">Toplam</span>
            </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color.replace("text-", "bg-")}`} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{(item.value / total * 100).toFixed(0)}%</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
