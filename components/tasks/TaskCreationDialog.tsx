"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TaskForm } from "./TaskForm";
import { useState } from "react";

export function TaskCreationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Yeni Görev
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni Görev Oluştur</DialogTitle>
          <DialogDescription>
            Yeni bir görev oluşturmak için aşağıdaki detayları doldurun. İşiniz bittiğinde kaydedin.
          </DialogDescription>
        </DialogHeader>
        <TaskForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
