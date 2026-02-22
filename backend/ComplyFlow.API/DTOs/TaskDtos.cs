using ComplyFlow.API.Models;
using TaskStatus = ComplyFlow.API.Models.TaskStatus;

namespace ComplyFlow.API.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public string TaskType { get; set; } = string.Empty;
    
    public int? AssignedToUserId { get; set; }
    public string? AssignedToUserName { get; set; }
    
    public int? AssignedToGroupId { get; set; }
    public string? AssignedToGroupName { get; set; }

    public List<SubTaskDto> SubTasks { get; set; } = new List<SubTaskDto>();
    public List<TaskLogDto> TaskLogs { get; set; } = new List<TaskLogDto>();
}

public class SubTaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public int? AssignedToUserId { get; set; }
    public string? AssignedToUserName { get; set; }
}

public class TaskLogDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public int PerformedByUserId { get; set; }
}

public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskPriority Priority { get; set; }
    public TaskStatus Status { get; set; }
    public DateTime DueDate { get; set; }
    public int? AssignedToUserId { get; set; }
    public int? AssignedToGroupId { get; set; }
    public string TaskType { get; set; } = string.Empty;
}

public class UpdateTaskStatusDto
{
    public TaskStatus Status { get; set; }
}
