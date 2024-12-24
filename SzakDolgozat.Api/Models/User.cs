using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SzakDolgozat.Api.Models
{
    public class User : IdentityUser
    {
        [Required]
        public int Role { get; set; }

        [StringLength(100)]
        public string? FirstName { get; set; }

        [StringLength(100)]
        public string? LastName { get; set; }

        public virtual ICollection<ProjectUser> ProjectUsers { get; set; }
    }
}
public enum UserRole
{
    Admin = 1,
    Developer = 2,
    Reader = 3
}