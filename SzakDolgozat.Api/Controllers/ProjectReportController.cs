using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SzakDolgozat.Api.Data;
using SzakDolgozat.Api.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProjectReportController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly ILogger<ProjectReportController> _logger;

    public ProjectReportController(
        ApplicationDbContext context,
        UserManager<User> userManager,
        ILogger<ProjectReportController> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<ProjectReport>>> GetProjectReports(int projectId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);
            var project = await _context.Projects.FindAsync(projectId);

            if (project == null)
                return NotFound("Project not found");

            if (user.Role == (int)UserRole.Reader && !project.IsActive)
                return Forbid();

            var reports = await _context.ProjectReports
                .Include(r => r.CreatedBy)
                .Where(r => r.ProjectId == projectId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reports);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting project reports");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<ProjectReport>> CreateReport(ProjectReport report)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);
            var project = await _context.Projects.FindAsync(report.ProjectId);

            if (project == null)
                return NotFound("Project not found");

            if (user.Role == (int)UserRole.Reader)
                return Forbid();

            report.CreatedById = userId;
            report.CreatedAt = DateTime.UtcNow;

            _context.ProjectReports.Add(report);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectReports),
                new { projectId = report.ProjectId }, report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating project report");
            return StatusCode(500, "Internal server error");
        }
    }
}