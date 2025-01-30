using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SzakDolgozat.Api.Data;
using SzakDolgozat.Api.Models;
using SzakDolgozat.Api.Services;
using System.Security.Claims;

namespace SzakDolgozat.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectDocumentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly DocumentService _documentService;
        private readonly ILogger<ProjectDocumentController> _logger;

        public ProjectDocumentController(
            ApplicationDbContext context,
            DocumentService documentService,
            ILogger<ProjectDocumentController> logger)
        {
            _context = context;
            _documentService = documentService;
            _logger = logger;
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectDocument>>> GetProjectDocuments(int projectId)
        {
            var documents = await _context.ProjectDocuments
                .Include(d => d.CreatedBy)
                .Where(d => d.ProjectId == projectId)
                .ToListAsync();

            return Ok(documents);
        }

        [HttpPost("upload/{projectId}")]
        public async Task<IActionResult> UploadDocument(int projectId, IFormFile file)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var project = await _context.Projects.FindAsync(projectId);

                if (project == null)
                    return NotFound("Project not found");

                var (isSuccess, filePath, errorMessage) = await _documentService.SaveDocumentAsync(file, projectId);

                if (!isSuccess)
                    return BadRequest(errorMessage);

                var document = new ProjectDocument
                {
                    ProjectId = projectId,
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    FilePath = filePath,
                    FileSize = file.Length,
                    UploadedAt = DateTime.UtcNow,
                    CreatedById = userId
                };

                _context.ProjectDocuments.Add(document);
                await _context.SaveChangesAsync();

                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document");
                return StatusCode(500, "Error uploading document");
            }
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadDocument(int id)
        {
            var document = await _context.ProjectDocuments.FindAsync(id);

            if (document == null)
                return NotFound();

            if (!System.IO.File.Exists(document.FilePath))
                return NotFound("File not found");

            var memory = new MemoryStream();
            using (var stream = new FileStream(document.FilePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return File(memory, _documentService.GetContentType(document.FilePath), document.FileName);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            var document = await _context.ProjectDocuments.FindAsync(id);

            if (document == null)
                return NotFound();

            if (_documentService.DeleteDocument(document.FilePath))
            {
                _context.ProjectDocuments.Remove(document);
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return StatusCode(500, "Error deleting document");
        }
    }
}