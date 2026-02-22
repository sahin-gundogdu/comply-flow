using ComplyFlow.API.Data;
using ComplyFlow.API.DTOs;
using ComplyFlow.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskStatus = ComplyFlow.API.Models.TaskStatus;

namespace ComplyFlow.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
    {
        return await _context.TaskItems
            .Include(t => t.AssignedToUser)
            .Include(t => t.AssignedToGroup)
            .Include(t => t.SubTasks)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority.ToString(),
                Status = t.Status.ToString(),
                DueDate = t.DueDate,
                CompletedDate = t.CompletedDate,
                TaskType = t.TaskType,
                AssignedToUserId = t.AssignedToUserId,
                AssignedToUserName = t.AssignedToUser != null ? t.AssignedToUser.FullName : null,
                AssignedToGroupId = t.AssignedToGroupId,
                AssignedToGroupName = t.AssignedToGroup != null ? t.AssignedToGroup.Name : null,
                SubTasks = t.SubTasks.Select(st => new SubTaskDto
                {
                    Id = st.Id,
                    Title = st.Title,
                    IsCompleted = st.IsCompleted,
                    AssignedToUserId = st.AssignedToUserId,
                    AssignedToUserName = st.AssignedToUser != null ? st.AssignedToUser.FullName : null
                }).ToList()
            })
            .ToListAsync();
    }

    // GET: api/Tasks/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTaskItem(int id)
    {
        var taskItem = await _context.TaskItems
            .Include(t => t.AssignedToUser)
            .Include(t => t.AssignedToGroup)
            .Include(t => t.SubTasks)
            .Include(t => t.TaskLogs)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (taskItem == null)
        {
            return NotFound();
        }

        return new TaskDto
        {
            Id = taskItem.Id,
            Title = taskItem.Title,
            Description = taskItem.Description,
            Priority = taskItem.Priority.ToString(),
            Status = taskItem.Status.ToString(),
            DueDate = taskItem.DueDate,
            CompletedDate = taskItem.CompletedDate,
            TaskType = taskItem.TaskType,
            AssignedToUserId = taskItem.AssignedToUserId,
            AssignedToUserName = taskItem.AssignedToUser?.FullName,
            AssignedToGroupId = taskItem.AssignedToGroupId,
            AssignedToGroupName = taskItem.AssignedToGroup?.Name,
            SubTasks = taskItem.SubTasks.Select(st => new SubTaskDto
            {
                Id = st.Id,
                Title = st.Title,
                IsCompleted = st.IsCompleted,
                AssignedToUserId = st.AssignedToUserId,
                AssignedToUserName = st.AssignedToUser?.FullName
            }).ToList(),
            TaskLogs = taskItem.TaskLogs.Select(tl => new TaskLogDto
            {
                Id = tl.Id,
                Action = tl.Action,
                Timestamp = tl.Timestamp,
                PerformedByUserId = tl.PerformedByUserId
            }).OrderByDescending(tl => tl.Timestamp).ToList()
        };
    }

    // POST: api/Tasks
    [HttpPost]
    public async Task<ActionResult<TaskItem>> PostTaskItem(CreateTaskDto createTaskDto)
    {
        var taskItem = new TaskItem
        {
            Title = createTaskDto.Title,
            Description = createTaskDto.Description,
            Priority = createTaskDto.Priority,
            Status = createTaskDto.Status,
            DueDate = createTaskDto.DueDate,
            AssignedToUserId = createTaskDto.AssignedToUserId,
            AssignedToGroupId = createTaskDto.AssignedToGroupId,
            TaskType = createTaskDto.TaskType
        };

        _context.TaskItems.Add(taskItem);
        await _context.SaveChangesAsync();
        
        // Add log
        _context.TaskLogs.Add(new TaskLog
        {
            TaskItemId = taskItem.Id,
            Action = "Task Created",
            Timestamp = DateTime.Now,
            PerformedByUserId = 1 // TODO: Get from current user context
        });
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTaskItem", new { id = taskItem.Id }, taskItem);
    }

    // PUT: api/Tasks/5/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateTaskStatus(int id, UpdateTaskStatusDto updateDto)
    {
        var taskItem = await _context.TaskItems.FindAsync(id);
        if (taskItem == null)
        {
            return NotFound();
        }

        var oldStatus = taskItem.Status;
        taskItem.Status = updateDto.Status;

        if (updateDto.Status == TaskStatus.Completed && oldStatus != TaskStatus.Completed)
        {
            taskItem.CompletedDate = DateTime.Now;
        }
        else if (updateDto.Status != TaskStatus.Completed)
        {
            taskItem.CompletedDate = null;
        }

        _context.TaskLogs.Add(new TaskLog
        {
            TaskItemId = taskItem.Id,
            Action = $"Status changed from {oldStatus} to {updateDto.Status}",
            Timestamp = DateTime.Now,
            PerformedByUserId = 1 // TODO: Get from current user context
        });

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
