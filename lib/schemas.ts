import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2, {
    message: "Başlık en az 2 karakter olmalıdır.",
  }),
  description: z.string().optional(),
  type: z.enum(["Proje", "Sözleşme", "Personel", "KVKK", "Diğer"]),
  priority: z.enum(["Kritik", "Yüksek", "Orta", "Düşük"]),
  status: z.enum(["Beklemede", "İşlemde", "Tamamlandı", "Gecikmiş"]),
  deadline: z.date(),
  completionDate: z.date().optional(),
  assignmentType: z.enum(["user", "group"]),
  assignedUser: z.string().optional(),
  assignedGroup: z.string().optional(),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1, "Alt görev başlığı gereklidir"),
        assignmentType: z.enum(["user", "group", "none"]).optional(),
        assignedUser: z.string().optional(),
        assignedGroup: z.string().optional(),
        deadline: z.date().optional(),
      })
    )
    .optional(),
  files: z.any().optional(), // File upload handling can be complex, using any for prototype
}).refine(
  (data) => {
    if (data.assignmentType === "user" && !data.assignedUser) {
      return false;
    }
    if (data.assignmentType === "group" && !data.assignedGroup) {
      return false;
    }
    return true;
  },
  {
    message: "Lütfen atanan kişiyi veya grubu belirtin.",
    path: ["assignedUser"], // Error path
  }
);

export type TaskFormValues = z.infer<typeof taskSchema>;
