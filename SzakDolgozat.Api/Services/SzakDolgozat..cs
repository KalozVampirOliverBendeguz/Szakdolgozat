using Microsoft.AspNetCore.StaticFiles;
using SzakDolgozat.Api.Models;

namespace SzakDolgozat.Api.Services
{
    public class DocumentService
    {
        private readonly string[] allowedExtensions = new[] {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx",
            ".ppt", ".pptx", ".txt", ".rtf"
        };
        private readonly string uploadsFolder;

        public DocumentService(IWebHostEnvironment environment)
        {
            uploadsFolder = Path.Combine(environment.ContentRootPath, "Uploads", "Projects");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
        }

        public async Task<(bool isSuccess, string filePath, string errorMessage)> SaveDocumentAsync(
            IFormFile file, int projectId)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return (false, string.Empty, "Invalid file type");
            }

            var projectFolder = Path.Combine(uploadsFolder, projectId.ToString(), "Documents");
            if (!Directory.Exists(projectFolder))
            {
                Directory.CreateDirectory(projectFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(projectFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return (true, filePath, string.Empty);
        }

        public bool DeleteDocument(string filePath)
        {
            try
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public string GetContentType(string filePath)
        {
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filePath, out string contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }
    }
}