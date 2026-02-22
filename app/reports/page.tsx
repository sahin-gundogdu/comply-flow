import { Metadata } from "next";
import { ReportStats } from "@/components/reports/ReportStats";
import { ReportCharts } from "@/components/reports/ReportCharts";
import { ReportTable } from "@/components/reports/ReportTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Raporlar | Hukuk & Uyumluluk",
  description: "Detaylı analizler ve performans raporları.",
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Raporlar & Analizler</h1>
      </div>

      {/* Advanced Filtering */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4 shadow-sm bg-card">
        <div className="flex-1 min-w-[200px]">
            <Input placeholder="Rapor verilerinde ara..." />
        </div>
        <div className="w-[200px]">
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Departman Seç" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="uyum">Uyum Ekibi</SelectItem>
                    <SelectItem value="kvkk">KVKK Grubu</SelectItem>
                    <SelectItem value="hukuk">Hukuk Departmanı</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="w-[200px]">
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Kişi Seç" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="alice">Alice Smith</SelectItem>
                    <SelectItem value="bob">Bob Jones</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
        {/* Date Range Picker Mockup using two inputs for simplicity in prototype */}
        <div className="flex gap-2">
             <Button variant={"outline"} className="w-[150px] justify-start text-left font-normal text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Başlangıç</span>
             </Button>
             <Button variant={"outline"} className="w-[150px] justify-start text-left font-normal text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Bitiş</span>
             </Button>
        </div>
        
        <Button>Filtrele</Button>
      </div>
      
      <ReportStats />
      <ReportCharts />
      <ReportTable />
    </div>
  );
}
