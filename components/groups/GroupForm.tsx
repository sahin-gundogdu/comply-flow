"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Group, CreateGroupDto, UpdateGroupDto } from "@/types";
import { createGroup, updateGroup } from "@/lib/api";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Grup adı en az 2 karakter olmalıdır"),
});

interface GroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: Group | null;
  onSuccess: () => void;
}

export function GroupForm({ open, onOpenChange, group, onSuccess }: GroupFormProps) {
  const isEdit = !!group;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (group) {
        form.reset({
          name: group.name,
        });
      } else {
        form.reset({
          name: "",
        });
      }
    }
  }, [open, group, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEdit && group) {
        const payload: UpdateGroupDto = {
            name: values.name !== group.name ? values.name : undefined,
        };
        await updateGroup(group.id, payload);
        toast({ title: "Başarılı", description: "Grup başarıyla güncellendi." });
      } else {
        const payload: CreateGroupDto = {
            name: values.name,
        };
        await createGroup(payload);
        toast({ title: "Başarılı", description: "Yeni grup başarıyla eklendi." });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Grubu Düzenle" : "Yeni Grup Ekle"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grup / Departman Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: İnsan Kaynakları" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4 space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    İptal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEdit ? "Güncelle" : "Kaydet"}
                </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
