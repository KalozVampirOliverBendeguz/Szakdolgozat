using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SzakDolgozat.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotificationPreferences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    DaysBeforeDeadline = table.Column<int>(type: "int", nullable: false),
                    FrequencyInDays = table.Column<int>(type: "int", nullable: false),
                    OnlyActiveProjects = table.Column<bool>(type: "bit", nullable: false),
                    OnlyAssignedProjects = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationPreferences_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notifications_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0713ae1b-c1c4-45f5-b4f0-cbd98977ee9a",
                column: "ConcurrencyStamp",
                value: "81307a1c-14d5-4b8b-9475-d340c48e05b5");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8450e6c0-e5a6-41b2-8957-978998ebdaeb",
                column: "ConcurrencyStamp",
                value: "d9d46da1-1db2-4205-9c26-02539ee814ed");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ca1b544d-b871-4344-a8bd-d73d30a36307",
                column: "ConcurrencyStamp",
                value: "57ea93b4-f6ff-48e1-8bb6-9de28dee639b");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1a5ef115-89dc-483c-8539-f82f89250cc3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "0c2b9f14-8505-41a9-82d2-3e29b9162ed3", "AQAAAAIAAYagAAAAEFq/I1nUxJCUX2GN33Bcfx1QlOmM60awuApzEHjKoR6pKMzVotEduK6PppIac0GPgA==", "c6fd7e52-b718-4b24-ae00-7c708094df70" });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationPreferences_UserId",
                table: "NotificationPreferences",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ProjectId",
                table: "Notifications",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationPreferences");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0713ae1b-c1c4-45f5-b4f0-cbd98977ee9a",
                column: "ConcurrencyStamp",
                value: "80190d53-2fdd-4f90-989d-ce540421af8b");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8450e6c0-e5a6-41b2-8957-978998ebdaeb",
                column: "ConcurrencyStamp",
                value: "3b4c8690-1aac-4d0c-9ad7-4afb0d8b1a94");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ca1b544d-b871-4344-a8bd-d73d30a36307",
                column: "ConcurrencyStamp",
                value: "e2dda242-c689-4bbd-89b6-3e1c9404084c");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1a5ef115-89dc-483c-8539-f82f89250cc3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e656552b-df39-4dfd-bcf0-d8da47cca2a7", "AQAAAAIAAYagAAAAEEfNBu7lbDsIqlaKe5zus3DP8TG58KFkVGBfD4LX8fqLrKgYHWyp9a9Q5aaF0+wR/w==", "fc612677-2dd6-4e91-9d53-a7f5b0f1b2b2" });
        }
    }
}
