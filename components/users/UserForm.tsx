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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, CreateUserDto, UpdateUserDto, Role } from "@/types";
import { createUser, updateUser, fetchRoles } from "@/lib/api";
import { Loader2 } from "lucide-react";

const getFormSchema = (isEdit: boolean) => z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  password: isEdit 
    ? z.string().optional() 
    : z.string().min(1, "Şifre zorunludur"),
  role: z.string().min(1, "Lütfen bir rol seçin"),
});

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSuccess: () => void;
}

export function UserForm({ open, onOpenChange, user, onSuccess }: UserFormProps) {
  const isEdit = !!user;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch (error) {
        console.error("Failed to load roles:", error);
      }
    }
    if (open) {
      loadRoles();
    }
  }, [open]);

  const formSchema = getFormSchema(isEdit);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      role: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          fullName: user.fullName,
          username: user.username,
          password: "", // Don't populate password for security
          role: user.role,
        });
      } else {
        form.reset({
          fullName: "",
          username: "",
          password: "",
          role: "",
        });
      }
    }
  }, [open, user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEdit && user) {
        const payload: UpdateUserDto = {
            fullName: values.fullName !== user.fullName ? values.fullName : undefined,
            username: values.username !== user.username ? values.username : undefined,
            role: values.role !== user.role ? values.role : undefined,
            password: values.password ? values.password : undefined,
        };
        await updateUser(user.id, payload);
        toast({ title: "Başarılı", description: "Kullanıcı başarıyla güncellendi." });
      } else {
        const payload: CreateUserDto = {
            fullName: values.fullName,
            username: values.username,
            password: values.password,
            role: values.role,
        };
        await createUser(payload);
        toast({ title: "Başarılı", description: "Yeni kullanıcı başarıyla eklendi." });
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
          <DialogTitle>{isEdit ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Ahmet Yılmaz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: ahmetyilmaz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEdit ? "Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)" : "Şifre"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kullanıcı rolünü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
