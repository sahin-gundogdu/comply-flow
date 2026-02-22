using System.ComponentModel.DataAnnotations;

namespace ComplyFlow.API.Models;

public class SubTask
{
    public int Id { get; set; }
    
    public int TaskItemId { get; set; }
    public TaskItem TaskItem { get; set; } = null!; // Required navigation

    [Required]
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }

    public int? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }
}
