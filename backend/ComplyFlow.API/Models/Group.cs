using System.ComponentModel.DataAnnotations;

namespace ComplyFlow.API.Models;

public class Group
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
