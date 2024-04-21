using System.Text.Json.Serialization;

namespace API.Models
{
    public class BookingPayment
    {
        public int Id { get; set; }
        public DateTime PaymentDate { get; set; }
        public StatusBookingPayment Status { get; set; }
        public int BookingId { get; set; }
        [JsonIgnore]
        public Booking Booking { get; set; }
        public string? PaymentIntentId0 { get; set; }
        public string? ClientSecret0 { get; set; }
        public string? PaymentIntentId1 { get; set; }
        public string? ClientSecret1 { get; set; }
        public string? PaymentIntentId2 { get; set; }
        public string? ClientSecret2 { get; set; }
    }
}
