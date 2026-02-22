"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const taskByGroupData = [
  { name: "Uyum", atanmış: 40, tamamlanan: 24 },
  { name: "KVKK", atanmış: 30, tamamlanan: 13 },
  { name: "Hukuk", atanmış: 20, tamamlanan: 18 },
  { name: "İK", atanmış: 27, tamamlanan: 19 },
];

const priorityData = [
  { name: "Kritik", value: 10 },
  { name: "Yüksek", value: 25 },
  { name: "Orta", value: 45 },
  { name: "Düşük", value: 20 },
];

const COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6"];

const monthlyVolumeData = [
  { name: "Oca", görev: 40 },
  { name: "Şub", görev: 30 },
  { name: "Mar", görev: 20 },
  { name: "Nis", görev: 27 },
  { name: "May", görev: 18 },
  { name: "Haz", görev: 23 },
];

export function ReportCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Gruba Göre Görevler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taskByGroupData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.atanmış} Atanan / {item.tamamlanan} Tamamlanan</span>
                </div>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(item.atanmış / 50) * 100}%` }}
                  />
                   <div
                    className="h-full bg-green-500"
                    style={{ width: `${(item.tamamlanan / 50) * 100}%`, marginLeft: -`${(item.atanmış / 50) * 100}%` }} // Simplified visual logic
                  />
                </div>
                {/* Simplified bar representation: Stacked logic or side-by-side needs flex */}
                <div className="flex h-2 w-full gap-1">
                     <div className="h-full rounded-full bg-blue-500" style={{ width: `${(item.atanmış / 50) * 100}%` }}></div>
                     <div className="h-full rounded-full bg-green-500" style={{ width: `${(item.tamamlanan / 50) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Öncelik Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="flex h-[350px] items-center justify-center">
                <div className="relative h-48 w-48 rounded-full border-8 border-blue-500 p-4">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold">100</span>
                        <span className="text-sm text-muted-foreground">Görev</span>
                    </div>
                     {/* CSS-only Donut chart is complex, using simplified list instead */}
                </div>
             </div>
             <div className="mt-4 space-y-2">
                {priorityData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                            <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Aylık Görev Hacmi</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2">
                {monthlyVolumeData.map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-2 w-full">
                         <div 
                            className="w-full bg-primary/20 rounded-t-md hover:bg-primary/30 transition-colors relative group"
                            style={{ height: `${item.görev * 4}px` }}
                         >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">{item.görev}</span>
                         </div>
                         <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
