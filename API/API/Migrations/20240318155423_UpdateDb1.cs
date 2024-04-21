using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDb1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Booking_Rooms_RoomId",
                table: "Booking");

            migrationBuilder.DropIndex(
                name: "IX_Booking_RoomId",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "QuantityRoom",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "QuantityRoomExcess",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "Booking");

            migrationBuilder.CreateTable(
                name: "ListRooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    QuantityRoom = table.Column<int>(type: "int", nullable: false),
                    QuantityRoomExcess = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListRooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListRooms_Booking_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Booking",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListRooms_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListRooms_BookingId",
                table: "ListRooms",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_ListRooms_RoomId",
                table: "ListRooms",
                column: "RoomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListRooms");

            migrationBuilder.AddColumn<int>(
                name: "QuantityRoom",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "QuantityRoomExcess",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Booking_RoomId",
                table: "Booking",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Booking_Rooms_RoomId",
                table: "Booking",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
