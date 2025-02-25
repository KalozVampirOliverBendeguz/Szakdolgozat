using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SzakDolgozat.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixNotificationPreferenceUserRequirement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0713ae1b-c1c4-45f5-b4f0-cbd98977ee9a",
                column: "ConcurrencyStamp",
                value: "8c010c1d-a274-4039-851b-699641b773e3");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8450e6c0-e5a6-41b2-8957-978998ebdaeb",
                column: "ConcurrencyStamp",
                value: "157a4fb3-38b1-4632-bde4-c56dd2312835");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ca1b544d-b871-4344-a8bd-d73d30a36307",
                column: "ConcurrencyStamp",
                value: "414fa3b0-5995-46f1-899a-7638ee4121f3");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1a5ef115-89dc-483c-8539-f82f89250cc3",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "cf22c3ee-f002-41d5-bf87-bc271c5386c4", "AQAAAAIAAYagAAAAEBnSrmUg5Y5vCgjVCBeNcYTexLvkcJ0qUepS3vgCh1UPg5855Dsl1FHjJV5ntkkpfA==", "cba457ce-b998-43de-bf5c-61a96fe7264c" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
