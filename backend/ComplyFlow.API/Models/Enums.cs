namespace ComplyFlow.API.Models;

public enum TaskPriority
{
    Low,
    Medium,
    High,
    Critical
}

public enum TaskStatus
{
    Open,
    InProgress,
    Review,
    Completed,
    Overdue
}
