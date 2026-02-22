using System.ComponentModel.DataAnnotations;

namespace ComplyFlow.API.Models;

public class TaskLog
{
    public int Id { get; set; }
    
    public int TaskItemId { get; set; }
    public TaskItem TaskItem { get; set; } = null!;

    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.Now;
    public int PerformedByUserId { get; set; }
}
