using System.Text.Json.Serialization;

namespace API.Models
{
    public class CommentImages
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public int CommentId { get; set; }
        [JsonIgnore]
        public Comment Comment { get; set; }
    }
}
