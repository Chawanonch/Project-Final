using System.Text.Json.Serialization;

namespace API.Models
{
    public class CommentPackage
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public double Star { get; set; }
        public int BookingPackageId { get; set; }
        [JsonIgnore]
        public BookingPackage BookingPackage { get; set; }
        public ICollection<CommentPackageImages> CommentPackageImages { get; set; }
    }
}
