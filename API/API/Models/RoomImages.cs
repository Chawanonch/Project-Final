using System.Text.Json.Serialization;

namespace API.Models
{
    public class RoomImages
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public int RoomId { get; set; }
        [JsonIgnore]
        public Room Room { get; set; }
    }
}
