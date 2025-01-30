﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SzakDolgozat.Api.Models;

namespace SzakDolgozat.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectUser> ProjectUsers { get; set; }

        public DbSet<ProjectReport> ProjectReports { get; set; }

        public DbSet<ProjectDocument> ProjectDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

         
            modelBuilder.Entity<ProjectUser>()
                .HasKey(pu => new { pu.ProjectId, pu.UserId });

            modelBuilder.Entity<ProjectUser>()
                .HasOne(pu => pu.Project)
                .WithMany(p => p.ProjectUsers)
                .HasForeignKey(pu => pu.ProjectId);

            modelBuilder.Entity<ProjectUser>()
                .HasOne(pu => pu.User)
                .WithMany(u => u.ProjectUsers)
                .HasForeignKey(pu => pu.UserId);

            modelBuilder.Entity<ProjectReport>()
                .HasOne(pr => pr.Project)
                .WithMany()
                .HasForeignKey(pr => pr.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasOne(p => p.User)
                      .WithMany()
                      .HasForeignKey(p => p.UserId)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(p => p.CreatedBy)
                      .WithMany()
                      .HasForeignKey(p => p.CreatedById)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            // IdentityRole adatok
            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole
                {
                    Id = "8450e6c0-e5a6-41b2-8957-978998ebdaeb",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                },
                new IdentityRole
                {
                    Id = "ca1b544d-b871-4344-a8bd-d73d30a36307",
                    Name = "Developer",
                    NormalizedName = "DEVELOPER",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                },
                new IdentityRole
                {
                    Id = "0713ae1b-c1c4-45f5-b4f0-cbd98977ee9a",
                    Name = "Reader",
                    NormalizedName = "READER",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                }
            );

            var adminId = "1a5ef115-89dc-483c-8539-f82f89250cc3";
            var adminUser = new User
            {
                Id = adminId,
                UserName = "admin@admin.com",
                NormalizedUserName = "ADMIN@ADMIN.COM",
                Email = "admin@admin.com",
                NormalizedEmail = "ADMIN@ADMIN.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                Role = (int)UserRole.Admin
            };

            var hasher = new PasswordHasher<User>();
            adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin123!");

            modelBuilder.Entity<User>().HasData(adminUser);

            // Admin role assignment
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>
                {
                    RoleId = "8450e6c0-e5a6-41b2-8957-978998ebdaeb", // Admin role ID
                    UserId = adminId
                }
            );
        }
    }
}
