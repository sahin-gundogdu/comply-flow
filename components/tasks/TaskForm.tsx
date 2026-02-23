"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Plus, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { taskSchema, type TaskFormValues } from "@/lib/schemas";
import { fetchUsers, fetchGroups, createTask, updateTask } from "@/lib/api";
import { User, Group } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// Temporary mock for Textarea if not installed, but usually Input component handles text
// Shadcn usually has a separate Textarea component. I will use Input as 'textarea' or standard textarea if needed.
// Actually standard shadcn has Textarea. I'll stick to Input for now if I missed installing textarea,
// but the customized Input can act as one or I'll just use a native textarea with shadcn styling.
// Better: I'll use a native <textarea> with the Input classes for now to be safe.

interface TaskFormProps {
  onClose?: () => void;
  readOnly?: boolean;
  defaultValues?: TaskFormValues;
  taskId?: number;
}

export function TaskForm({
  onClose,
  readOnly = false,
  defaultValues,
  taskId,
}: TaskFormProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      type: "Proje",
      assignmentType: "user",
      subtasks: [],
      priority: "Orta",
      status: "Beklemede",
      deadline: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  useEffect(() => {
    async function loadOptions() {
      setIsLoadingUsers(true);
      setIsLoadingGroups(true);
      try {
        const [u, g] = await Promise.all([fetchUsers(), fetchGroups()]);
        setUsers(u);
        setGroups(g);
      } catch (err) {
        console.error("Failed to load options");
      } finally {
        setIsLoadingUsers(false);
        setIsLoadingGroups(false);
      }
    }
    loadOptions();
  }, []);

  async function onSubmit(data: TaskFormValues) {
    if (readOnly) {
      onClose?.();
      return;
    }

    try {
      // Map to backend structure
      const payload: any = {
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        status: data.status,
        dueDate: data.deadline.toISOString().split("T")[0],
      };

      if (data.assignmentType === "user" && data.assignedUser) {
        payload.assignedToUserId = parseInt(data.assignedUser, 10);
      } else if (data.assignmentType === "group" && data.assignedGroup) {
        payload.assignedToGroupId = parseInt(data.assignedGroup, 10);
      }

      if (taskId) {
        await updateTask(taskId, payload);
        alert("Görev başarıyla güncellendi.");
      } else {
        await createTask(payload);
        alert("Görev başarıyla oluşturuldu.");
      }
      
      router.refresh();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert(taskId ? "Görev güncellenirken bir hata oluştu." : "Görev oluşturulurken bir hata oluştu.");
    }
  }

  const assignmentType = form.watch("assignmentType");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Başlık</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Görev başlığı"
                    {...field}
                    readOnly={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Açıklama</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Görev açıklaması..."
                    {...field}
                    readOnly={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tür</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={readOnly}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Proje">Proje</SelectItem>
                    <SelectItem value="Sözleşme">Sözleşme</SelectItem>
                    <SelectItem value="Personel">Personel</SelectItem>
                    <SelectItem value="KVKK">KVKK</SelectItem>
                    <SelectItem value="Diğer">Diğer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Öncelik</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Öncelik seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Kritik">Kritik</SelectItem>
                    <SelectItem value="Yüksek">Yüksek</SelectItem>
                    <SelectItem value="Orta">Orta</SelectItem>
                    <SelectItem value="Düşük">Düşük</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durum</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beklemede">Beklemede</SelectItem>
                    <SelectItem value="İşlemde">İşlemde</SelectItem>
                    <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                    <SelectItem value="Gecikmiş">Gecikmiş</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Son Tarih</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={readOnly}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Tarih seçin</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="assignmentType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Atama</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={readOnly}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="user" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Kullanıcıya Ata
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="group" />
                      </FormControl>
                      <FormLabel className="font-normal">Gruba Ata</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {assignmentType === "user" ? (
            <FormField
              control={form.control}
              name="assignedUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Seçin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={readOnly || isLoadingUsers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kullanıcı seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.fullName} ({u.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="assignedGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grup</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={readOnly || isLoadingGroups}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Grup seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id.toString()}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Alt Görevler</FormLabel>
            {!readOnly && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => append({ title: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Alt Görev Ekle
              </Button>
            )}
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`subtasks.${index}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Alt görev başlığı"
                        {...field}
                        readOnly={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`subtasks.${index}.assignee`}
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormControl>
                      <Input
                        placeholder="Atanan"
                        {...field}
                        readOnly={readOnly}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`subtasks.${index}.deadline`}
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            disabled={readOnly}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-10",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PP")
                            ) : (
                              <span>Tarih</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
              {!readOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <FormLabel>Ekler</FormLabel>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Yüklemek için tıklayın</span>{" "}
                  veya sürükleyip bırakın
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOCX, JPG (MAKS. 25MB)
                </p>
              </div>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            {readOnly ? "Kapat" : "İptal"}
          </Button>
            {!readOnly && <Button type="submit">{taskId ? "Değişiklikleri Kaydet" : "Görev Oluştur"}</Button>}
        </div>
      </form>
    </Form>
  );
}
