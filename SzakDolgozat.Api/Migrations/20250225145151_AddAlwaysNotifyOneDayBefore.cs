using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SzakDolgozat.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAlwaysNotifyOneDayBefore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AlwaysNotifyOneDayBefore",
                table: "NotificationPreferences",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0713ae1b-c1c4-45f5-b4f0-cbd98977ee9a",
                column: "ConcurrencyStamp",
                value: "71d0a3c7-a442-47dc-add3-5991a3a18309");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8450e6c0-e5a6-41b2-8957-978998ebdaeb",
                column: "ConcurrencyStamp",
                value: "31e9ef0b-7d2a-4115-a681-5d18dd10038d");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ca1b544d-b871-4344-a8bd-d73d30a36307",
                column: "ConcurrencyStamp",
                value: "3ed2811d-20a2-48ba-97ff-3f65e5587aa0");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1a5ef115-89dc-483c-8539-f82f89250cc3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c265df4c-d3b5-4d3e-853d-662569117f7e", "AQAAAAIAAYagAAAAEMRTdgwuvZm7ItwU9AEv8b6D++PWnO635QNSEAczzbVh7HaqE3rOAn/pUeH+JkPNHQ==", "53c3febc-e6d4-4a4e-85a0-ca95c744fcd3" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlwaysNotifyOneDayBefore",
                table: "NotificationPreferences");

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
        }
    }
}
