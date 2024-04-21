using System.Text.Json.Serialization;

namespace API.Models
{
    public class BookingPackagePayment
    {
        public int Id { get; set; }
        public DateTime PaymentDate { get; set; }
        public StatusBookingPayment Status { get; set; }
        public int BookingPackageId { get; set; }
        [JsonIgnore]
        public BookingPackage BookingPackage { get; set; }
        public string? PaymentIntentId0 { get; set; }
        public string? ClientSecret0 { get; set; }
        public string? PaymentIntentId1 { get; set; }
        public string? ClientSecret1 { get; set; }
        public string? PaymentIntentId2 { get; set; }
        public string? ClientSecret2 { get; set; }
    }
}
