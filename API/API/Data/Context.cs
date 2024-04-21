using API.Models;
using Microsoft.EntityFrameworkCore;


namespace API.Data
{
    public class Context : DbContext
    {
        private readonly IConfiguration _config;

        public Context(DbContextOptions options, IConfiguration config) : base(options)
        {
            _config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            //optionsBuilder.UseSqlServer(_config.GetConnectionString("DatabaseConnect"));
            optionsBuilder.UseSqlServer("Server=DESKTOP-DTGB06O\\SQLEXPRESS; Database=ProjectEndChawanon; Trusted_Connection=True; TrustServerCertificate=True");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>().HasData(
                new Role() { Id = 1, Name = "Admin" },
                new Role() { Id = 2, Name = "User" });
        }


        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Building> Building { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomImages> RoomImages { get; set; }
        public DbSet<Booking> Booking { get; set; }
        public DbSet<ListRoom> ListRooms { get; set; }
        public DbSet<BookingPayment> BookingPayments { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CommentImages> CommentImages { get; set; }
        public DbSet<Softpower> Softpowers { get; set; }
        public DbSet<SoftpowerType> SoftpowerTypes { get; set; }
        public DbSet<SoftpowerImages> SoftpowerImages { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<RoomPackage> RoomPackages { get; set; }
        public DbSet<SoftpowerPackage> SoftpowerPackages { get; set; }
        public DbSet<BookingPackage> BookingPackages { get; set; }
        public DbSet<ListPackage> ListPackages { get; set; }
        public DbSet<BookingPackagePayment> BookingPackagePayments { get; set; }
        public DbSet<CommentPackage> CommentPackages { get; set; }
        public DbSet<CommentPackageImages> CommentPackageImages { get; set; }
    }
}
