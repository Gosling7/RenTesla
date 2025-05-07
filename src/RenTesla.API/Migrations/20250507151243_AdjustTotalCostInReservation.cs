using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RenTesla.API.Migrations
{
    /// <inheritdoc />
    public partial class AdjustTotalCostInReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalCost",
                table: "Reservations",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalCost",
                table: "Reservations");
        }
    }
}
