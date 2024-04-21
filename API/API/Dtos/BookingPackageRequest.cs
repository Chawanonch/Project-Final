using API.Models;

namespace API.Dtos
{
    public class BookingPackageRequest
    {   
        public int? Id { get; set; }
        public List<ListPackageDto> ListPackages { get; set; }
        public double? TotalPriceBookingPackage { get; set; }
        public DateTime? DateCreated { get; set; } = DateTime.Now;
        public StatusBooking? Status { get; set; } = StatusBooking.Pending;
        public int? UserId { get; set; }
    }

    public class ListPackageDto
    {
        public int? Id { get; set; }
        public int PackageId { get; set; }
        public int? BookingPackageId { get; set; }
        public int Quantity { get; set; }
        public DateTime Start { get; set; }
        public DateTime? End { get; set; }
        public StatusCheckIn? CheckInDate { get; set; } = StatusCheckIn.NotCome;
        public DateTime? CheckInTime { get; set; } = DateTime.Now;
    }
}
