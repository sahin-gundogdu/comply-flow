import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusChartProps {
  className?: string;
}

export function StatusChart({ className }: StatusChartProps) {
  // Data for the chart
  const data = [
    { name: "Tamamlandı", value: 35, color: "text-green-500", stroke: "#22c55e" },
    { name: "İşlemde", value: 45, color: "text-blue-500", stroke: "#3b82f6" },
    { name: "Beklemede", value: 10, color: "text-yellow-500", stroke: "#eab308" },
    { name: "Gecikmiş", value: 10, color: "text-red-500", stroke: "#ef4444" },
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
