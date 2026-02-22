using ComplyFlow.API.Data;
using ComplyFlow.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ComplyFlow.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GroupsController : ControllerBase
{
    private readonly AppDbContext _context;

    public GroupsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupDto>>> GetGroups()
    {
        return await _context.Groups
            .Select(g => new GroupDto
            {
                Id = g.Id,
                Name = g.Name
            })
            .ToListAsync();
    }
}
