using API.Models;

namespace API.Dtos
{
    public class BookingPackagePaymentRequest
    {
        public int? Id { get; set; }
        public DateTime? PaymentDate { get; set; }
        public StatusBookingPayment Status { get; set; } = StatusBookingPayment.Pedding;
        public int BookingPackageId { get; set; }

        public string? PaymentIntentId0 { get; set; } = string.Empty;
        public string? ClientSecret0 { get; set; } = string.Empty;
        public string? PaymentIntentId1 { get; set; } = string.Empty;
        public string? ClientSecret1 { get; set; } = string.Empty;
        public string? PaymentIntentId2 { get; set; } = string.Empty;
        public string? ClientSecret2 { get; set; } = string.Empty;
    }
}
