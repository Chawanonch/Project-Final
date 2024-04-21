using System.Text.Json.Serialization;

namespace API.Models
{
    public class BookingPackage
    {
        public int Id { get; set; }
        public List<ListPackage> ListPackages { get; set; }
        public double TotalPriceBookingPackage { get; set; }
        public DateTime DateCreated { get; set; }
        public StatusBooking Status { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }

    public class ListPackage
    {
        public int Id { get; set; }
        public int PackageId { get; set; }
        [JsonIgnore]
        public Package Package { get; set; }
        public int BookingPackageId { get; set; }
        [JsonIgnore]
        public BookingPackage BookingPackage { get; set; }
        public int Quantity { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public StatusCheckIn CheckInDate { get; set; }
        public DateTime CheckInTime { get; set; }
    }
}
