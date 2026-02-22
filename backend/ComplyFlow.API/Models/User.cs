using System.ComponentModel.DataAnnotations;

namespace ComplyFlow.API.Models;

public class User
{
    public int Id { get; set; }
    
    [Required]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    public string Role { get; set; } = "User"; // Admin, User
    public string Title { get; set; } = string.Empty;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
