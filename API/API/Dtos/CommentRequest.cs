using API.Models;

namespace API.Dtos
{
    public class CommentRequest
    {
        public int? Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public double Star { get; set; }
        public int BookingId { get; set; }
        public IFormFileCollection? Images { get; set; }
    }
}
