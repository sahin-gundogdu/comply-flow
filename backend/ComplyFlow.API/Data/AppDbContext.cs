using Microsoft.EntityFrameworkCore;
using ComplyFlow.API.Models;
using TaskStatus = ComplyFlow.API.Models.TaskStatus;

namespace ComplyFlow.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<TaskItem> TaskItems { get; set; }
    public DbSet<SubTask> SubTasks { get; set; }
    public DbSet<TaskLog> TaskLogs { get; set; }
    public DbSet<Setting> Settings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships if needed manually, though conventions usually work.
        // TaskItem -> User (assigned)
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.AssignedToUser)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.AssignedToUserId)
            .OnDelete(DeleteBehavior.SetNull);

        // TaskItem -> Group (assigned)
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.AssignedToGroup)
            .WithMany(g => g.Tasks)
            .HasForeignKey(t => t.AssignedToGroupId)
            .OnDelete(DeleteBehavior.SetNull);

        // SubTask -> TaskItem
        modelBuilder.Entity<SubTask>()
            .HasOne(s => s.TaskItem)
            .WithMany(t => t.SubTasks)
            .HasForeignKey(s => s.TaskItemId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // TaskLog -> TaskItem
        modelBuilder.Entity<TaskLog>()
            .HasOne(l => l.TaskItem)
            .WithMany(t => t.TaskLogs)
            .HasForeignKey(l => l.TaskItemId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed Data
        // Groups
        modelBuilder.Entity<Group>().HasData(
            new Group { Id = 1, Name = "Hukuk" },
            new Group { Id = 2, Name = "Uyum" },
            new Group { Id = 3, Name = "KVKK" }
        );

        // Users
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Ahmet Yılmaz", Email = "ahmet.yilmaz@complyflow.com", Role = "User", Title = "Hukuk Müşaviri" },
            new User { Id = 2, FullName = "Ayşe Demir", Email = "ayse.demir@complyflow.com", Role = "User", Title = "Uyum Uzmanı" },
            new User { Id = 3, FullName = "Mehmet Öz", Email = "mehmet.oz@complyflow.com", Role = "Admin", Title = "IT Yöneticisi" },
            new User { Id = 4, FullName = "Zeynep Kaya", Email = "zeynep.kaya@complyflow.com", Role = "User", Title = "KVKK Uzmanı" }
        );

        // Tasks
        modelBuilder.Entity<TaskItem>().HasData(
            new TaskItem 
            { 
                Id = 1, 
                Title = "Tedarikçi Sözleşmesi Revizyonu", 
                Description = "Ana tedarikçi ile yapılan sözleşmenin yıllık revizyonu.", 
                Priority = TaskPriority.High, 
                Status = TaskStatus.InProgress,
                DueDate = DateTime.Now.AddDays(5),
                AssignedToUserId = 1, // Ahmet Yılmaz
                TaskType = "Contract"
            },
            new TaskItem 
            { 
                Id = 2, 
                Title = "KVKK Veri Envanteri Güncellemesi", 
                Description = "Departman bazlı veri envanterinin güncellenmesi gerekmektedir.", 
                Priority = TaskPriority.Critical, 
                Status = TaskStatus.Overdue,
                DueDate = DateTime.Now.AddDays(-2), // Overdue
                AssignedToUserId = 4, // Zeynep Kaya
                TaskType = "Compliance"
            },
            new TaskItem 
            { 
                Id = 3, 
                Title = "Personel Yönetmeliği Taslağı", 
                Description = "Yeni çalışma saatlerine uygun yönetmelik taslağı.", 
                Priority = TaskPriority.Medium, 
                Status = TaskStatus.Review,
                DueDate = DateTime.Now.AddDays(10),
                AssignedToGroupId = 2, // Uyum Grubu
                TaskType = "Draft"
            },
             new TaskItem 
            { 
                Id = 4, 
                Title = "Eski Arşivlerin Dijitalleştirilmesi", 
                Description = "2023 yılı öncesi hukuk arşivlerinin taranması.", 
                Priority = TaskPriority.Low, 
                Status = TaskStatus.Completed,
                DueDate = DateTime.Now.AddDays(-20),
                CompletedDate = DateTime.Now.AddDays(-15),
                AssignedToGroupId = 1, // Hukuk Grubu
                TaskType = "Project"
            },
            new TaskItem 
            { 
                Id = 5, 
                Title = "Yönetim Kurulu Sunumu Hazırlığı", 
                Description = "Aylık uyum raporlarının sunuma eklenmesi.", 
                Priority = TaskPriority.High, 
                Status = TaskStatus.Open,
                DueDate = DateTime.Now.AddDays(3),
                AssignedToUserId = 2, // Ayşe Demir
                TaskType = "Report"
            },
            new TaskItem
            {
                Id = 6,
                Title = "Gizlilik Politikası Güncellemesi",
                Description = "Web sitesi gizlilik politikasının yeni mevzuata göre güncellenmesi.",
                Priority = TaskPriority.Medium,
                Status = TaskStatus.Overdue,
                DueDate = DateTime.Now.AddDays(-5),
                AssignedToUserId = 1,
                TaskType = "Policy"
            }
        );

        // SubTasks for Task 1 (Tedarikçi Sözleşmesi)
        modelBuilder.Entity<SubTask>().HasData(
            new SubTask { Id = 1, TaskItemId = 1, Title = "Taslak sözleşmenin incelenmesi", IsCompleted = true, AssignedToUserId = 1 },
            new SubTask { Id = 2, TaskItemId = 1, Title = "Revizyon taleplerinin listelenmesi", IsCompleted = false, AssignedToUserId = 1 },
            new SubTask { Id = 3, TaskItemId = 1, Title = "Hukuk birimi onayı", IsCompleted = false, AssignedToUserId = 3 }
        );
    }
}
