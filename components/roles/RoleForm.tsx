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
import { Role, CreateRoleDto, UpdateRoleDto } from "@/types";
import { createRole, updateRole } from "@/lib/api";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Rol adı en az 2 karakter olmalıdır"),
});

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSuccess: () => void;
}

export function RoleForm({ open, onOpenChange, role, onSuccess }: RoleFormProps) {
  const isEdit = !!role;
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
      if (role) {
        form.reset({
          name: role.name,
        });
      } else {
        form.reset({
          name: "",
        });
      }
    }
  }, [open, role, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEdit && role) {
        const payload: UpdateRoleDto = {
            name: values.name !== role.name ? values.name : undefined,
        };
        await updateRole(role.id, payload);
        toast({ title: "Başarılı", description: "Rol başarıyla güncellendi." });
      } else {
        const payload: CreateRoleDto = {
            name: values.name,
        };
        await createRole(payload);
        toast({ title: "Başarılı", description: "Yeni rol başarıyla eklendi." });
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
          <DialogTitle>{isEdit ? "Rolü Düzenle" : "Yeni Rol Ekle"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Editor" {...field} />
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
