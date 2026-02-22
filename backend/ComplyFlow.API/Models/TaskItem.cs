using System.ComponentModel.DataAnnotations;

namespace ComplyFlow.API.Models;

public class TaskItem
{
    public int Id { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    public TaskPriority Priority { get; set; }
    public TaskStatus Status { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    
    public int? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }

    public int? AssignedToGroupId { get; set; }
    public Group? AssignedToGroup { get; set; }

    public string TaskType { get; set; } = string.Empty; // Contract, Project, etc.

    public ICollection<SubTask> SubTasks { get; set; } = new List<SubTask>();
    public ICollection<TaskLog> TaskLogs { get; set; } = new List<TaskLog>();
}
