namespace ComplyFlow.API.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
}

public class GroupDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
