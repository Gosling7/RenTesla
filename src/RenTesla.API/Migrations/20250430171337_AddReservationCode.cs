using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RenTesla.API.Migrations
{
    /// <inheritdoc />
    public partial class AddReservationCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReservationCode",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReservationCode",
                table: "Reservations");
        }
    }
}
