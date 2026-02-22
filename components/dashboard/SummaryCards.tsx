import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CircleDashed, Clock, AlertCircle } from "lucide-react";

const summaries = [
  {
    title: "Toplam Görev",
    value: "128",
    icon: CircleDashed,
    description: "Geçen aydan +%12 fazla",
    className: "text-blue-600",
  },
  {
    title: "Bekleyen Görevler",
    value: "42",
    icon: Clock,
    description: "Bu hafta 8 görev",
    className: "text-yellow-600",
  },
  {
    title: "Tamamlanan",
    value: "82",
    icon: CheckCircle2,
    description: "+%24 tamamlanma oranı",
    className: "text-green-600",
  },
  {
    title: "Gecikmiş",
    value: "4",
    icon: AlertCircle,
    description: "Acil dikkat gerekli",
    className: "text-red-600",
  },
];

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
