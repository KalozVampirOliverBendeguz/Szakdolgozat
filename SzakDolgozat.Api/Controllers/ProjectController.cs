using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SzakDolgozat.Api.Data;
using SzakDolgozat.Api.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using SzakDolgozat.Api.DTOs;
using System.Text.Json;

namespace SzakDolgozat.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<ProjectController> _logger;

        public ProjectController(
            ApplicationDbContext context,
            UserManager<User> userManager,
            ILogger<ProjectController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponseDto>>> GetProjects()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return Unauthorized();
                }

                var projects = await _context.Projects
                    .Include(p => p.User)
                    .Include(p => p.ProjectUsers)
                        .ThenInclude(pu => pu.User)
                    .AsNoTracking()
                    .ToListAsync();

                var projectDtos = projects.Select(p => new ProjectResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    ProjectManager = p.ProjectManager,
                    StartDate = p.StartDate,
                    PlannedEndDate = p.PlannedEndDate,
                    Description = p.Description,
                    Repository = p.Repository,
                    IsActive = p.IsActive,
                    UserId = p.UserId,
                    CreatedById = p.CreatedById,
                    AssignedUsers = p.ProjectUsers.Select(pu => new UserDto
                    {
                        Id = pu.User.Id,
                        UserName = pu.User.UserName,
                        Email = pu.User.Email
                    }).ToList()
                });

                if (user.Role == (int)UserRole.Developer)
                {
                    projectDtos = projectDtos.Where(p => p.UserId == userId || p.IsActive);
                }
                else if (user.Role == (int)UserRole.Reader)
                {
                    projectDtos = projectDtos.Where(p => p.IsActive);
                }

                return Ok(projectDtos.ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching projects: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(CreateProjectDto projectDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation($"Creating project with userId: {userId}");
                _logger.LogInformation($"Project data: {JsonSerializer.Serialize(projectDto)}");

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return Unauthorized();
                }

                if (user.Role == (int)UserRole.Reader)
                {
                    return Forbid();
                }

                if (projectDto.UserId != userId || projectDto.CreatedById != userId)
                {
                    return BadRequest(new { message = "Invalid user IDs" });
                }

                var project = new Project
                {
                    Name = projectDto.Name,
                    ProjectManager = projectDto.ProjectManager,
                    StartDate = projectDto.StartDate,
                    PlannedEndDate = projectDto.PlannedEndDate,
                    Description = projectDto.Description,
                    Repository = projectDto.Repository,
                    UserId = userId,
                    IsActive = true,
                    CreatedById = userId,
                    ProjectUsers = projectDto.ProjectUsers?.Select(pu => new ProjectUser
                    {
                        UserId = pu.UserId
                    }).ToList() ?? new List<ProjectUser>()
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Project created successfully with ID: {project.Id}");

                return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating project: {ex}");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectDto projectDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userManager.FindByIdAsync(userId);
                var existingProject = await _context.Projects
                    .Include(p => p.ProjectUsers)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (existingProject == null)
                {
                    return NotFound();
                }

                if (user == null)
                {
                    return Unauthorized();
                }

                if (user.Role == (int)UserRole.Reader)
                {
                    return Forbid();
                }

                if (user.Role == (int)UserRole.Developer && existingProject.UserId != userId)
                {
                    return Forbid();
                }

                existingProject.Name = projectDto.Name;
                existingProject.Description = projectDto.Description;
                existingProject.ProjectManager = projectDto.ProjectManager;
                existingProject.StartDate = projectDto.StartDate;
                existingProject.PlannedEndDate = projectDto.PlannedEndDate;
                existingProject.Repository = projectDto.Repository;

                _context.ProjectUsers.RemoveRange(existingProject.ProjectUsers);
                await _context.SaveChangesAsync();

                existingProject.ProjectUsers = projectDto.ProjectUsers.Select(pu => new ProjectUser
                {
                    ProjectId = id,
                    UserId = pu.UserId
                }).ToList();

                if (user.Role == (int)UserRole.Admin)
                {
                    existingProject.IsActive = projectDto.IsActive;
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating project: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userManager.FindByIdAsync(userId);
                var project = await _context.Projects
                    .Include(p => p.User)
                    .Include(p => p.ProjectUsers)
                        .ThenInclude(pu => pu.User)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (project == null)
                {
                    return NotFound();
                }

                if (user.Role == (int)UserRole.Reader && !project.IsActive)
                {
                    return Forbid();
                }

                if (user.Role == (int)UserRole.Developer &&
                    !project.IsActive && project.UserId != userId)
                {
                    return Forbid();
                }

                return project;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching project: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleProjectStatus(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userManager.FindByIdAsync(userId);
                var project = await _context.Projects.FindAsync(id);

                if (project == null)
                {
                    return NotFound();
                }

                if (user.Role != (int)UserRole.Admin)
                {
                    return Forbid();
                }

                project.IsActive = !project.IsActive;
                await _context.SaveChangesAsync();

                return Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error toggling project status: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userManager.FindByIdAsync(userId);
                var project = await _context.Projects.FindAsync(id);

                if (project == null)
                {
                    return NotFound();
                }

                if (user.Role != (int)UserRole.Admin)
                {
                    return Forbid();
                }

                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting project: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}