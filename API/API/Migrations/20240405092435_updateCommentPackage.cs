using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class updateCommentPackage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CommentPackages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Star = table.Column<double>(type: "float", nullable: false),
                    BookingPackageId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommentPackages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommentPackages_BookingPackages_BookingPackageId",
                        column: x => x.BookingPackageId,
                        principalTable: "BookingPackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CommentPackageImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CommentPackageId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommentPackageImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommentPackageImages_CommentPackages_CommentPackageId",
                        column: x => x.CommentPackageId,
                        principalTable: "CommentPackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CommentPackageImages_CommentPackageId",
                table: "CommentPackageImages",
                column: "CommentPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentPackages_BookingPackageId",
                table: "CommentPackages",
                column: "BookingPackageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CommentPackageImages");

            migrationBuilder.DropTable(
                name: "CommentPackages");
        }
    }
}
