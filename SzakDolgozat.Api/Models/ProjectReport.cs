using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SzakDolgozat.Api.Models;

namespace SzakDolgozat.Api.Models
{
  public class ProjectReport
  {
    [Key]
    public int Id { get; set; }

    [Required]
    public int ProjectId { get; set; }

    [Required]
    [StringLength(100)]
    public string Title { get; set; }

    [Required]
    public string Content { get; set; }

    public DateTime CreatedAt { get; set; }

    public string ReportType { get; set; }

    public string? CreatedById { get; set; }

    [ForeignKey("CreatedById")]
    public User? CreatedBy { get; set; }

    [ForeignKey("ProjectId")]
    public Project Project { get; set; }
  }
}
