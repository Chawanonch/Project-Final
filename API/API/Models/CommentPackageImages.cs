using System.Text.Json.Serialization;

namespace API.Models
{
    public class CommentPackageImages
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public int CommentPackageId { get; set; }
        [JsonIgnore]
        public CommentPackage CommentPackage { get; set; }
    }
}
