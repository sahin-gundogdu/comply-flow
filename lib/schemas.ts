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
        dueDate: z.date().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  files: z.any().optional(), // File upload handling can be complex, using any for prototype
}).superRefine((data, ctx) => {
  if (data.assignmentType === "user" && !data.assignedUser) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Lütfen atanan kişiyi veya grubu belirtin.",
      path: ["assignedUser"],
    });
  }
  if (data.assignmentType === "group" && !data.assignedGroup) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Lütfen atanan kişiyi veya grubu belirtin.",
      path: ["assignedGroup"],
    });
  }
  if (data.subtasks && data.deadline) {
    data.subtasks.forEach((st, index) => {
      if (st.dueDate && st.dueDate > data.deadline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Alt görev tarihi ana görev tarihinden sonra olamaz.",
          path: ["subtasks", index, "dueDate"],
        });
      }
    });
  }
});

export type TaskFormValues = z.infer<typeof taskSchema>;
