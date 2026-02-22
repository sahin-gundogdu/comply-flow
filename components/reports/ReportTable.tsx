"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Sheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast"

const reportData = [
  {
    id: "TASK-1024",
    title: "3. Çeyrek tedarikçi sözleşmesi incelemesi",
    finalStatus: "Tamamlandı",
    timeTaken: "5 Gün",
  },
  {
    id: "TASK-1025",
    title: "KVKK uyumluluk politikası güncellemesi",
    finalStatus: "Tamamlandı",
    timeTaken: "3 Gün",
  },
  {
    id: "TASK-1026",
    title: "Çalışan el kitabı revizyonu",
    finalStatus: "Tamamlandı",
    timeTaken: "7 Gün",
  },
  {
    id: "TASK-1029",
    title: "Yıllık güvenlik eğitimi",
    finalStatus: "Tamamlandı",
    timeTaken: "1 Gün",
  },
];

export function ReportTable() {
  const { toast } = useToast()

  const handleExport = (type: "PDF" | "Excel") => {
    console.log(JSON.stringify({ exportType: type, timestamp: new Date().toISOString() }, null, 2));
    toast({
      title: "Rapor Hazırlanıyor...",
      description: `${type} formatında rapor dışa aktarılıyor.`,
    })
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Rapor Önizleme</h2>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
                <FileText className="mr-2 h-4 w-4" /> PDF Olarak İndir
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("Excel")}>
                <Sheet className="mr-2 h-4 w-4" /> Excel Olarak İndir
            </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Son Durum</TableHead>
              <TableHead className="text-right">Süre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Badge variant="default">{item.finalStatus}</Badge>
                </TableCell>
                <TableCell className="text-right">{item.timeTaken}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
