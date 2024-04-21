using System.Text.Json.Serialization;

namespace API.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public double Star { get; set; }
        public int BookingId { get; set; }
        [JsonIgnore]
        public Booking Booking { get; set; }
        public ICollection<CommentImages> CommentImages { get; set; }
    }
}
