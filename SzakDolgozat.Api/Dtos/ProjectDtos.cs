using System.ComponentModel.DataAnnotations;

namespace SzakDolgozat.Api.DTOs
{
    public class ProjectUserDto
    {
        public string UserId { get; set; }
    }

    public class CreateProjectDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string ProjectManager { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime PlannedEndDate { get; set; }

        public string? Description { get; set; }
        public string? Repository { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public string CreatedById { get; set; }

        public List<ProjectUserDto> ProjectUsers { get; set; } = new List<ProjectUserDto>();
    }

    public class UpdateProjectDto
    {
        public string Name { get; set; }
        public string ProjectManager { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }
        public string? Description { get; set; }
        public string? Repository { get; set; }
        public bool IsActive { get; set; }
        public List<ProjectUserDto> ProjectUsers { get; set; } = new List<ProjectUserDto>();
    }

    public class ProjectResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ProjectManager { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }
        public string? Description { get; set; }
        public string? Repository { get; set; }
        public bool IsActive { get; set; }
        public string? UserId { get; set; }
        public string CreatedById { get; set; }
        public List<UserDto> AssignedUsers { get; set; } = new List<UserDto>();
    }

    public class UserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}