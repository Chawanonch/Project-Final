using System.Text.Json.Serialization;

namespace API.Models
{
    public class SoftpowerImages
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public int SoftpowerId { get; set; }
        [JsonIgnore]
        public Softpower Softpower { get; set; }
    }
}
