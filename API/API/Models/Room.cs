using System.Text.Json.Serialization;

namespace API.Models
{
    public class Room
    {
        public int Id { get; set; }

        public int BuildingId { get; set; }
        [JsonIgnore]
        public Building Building { get; set; }

        public int RoomTypeId { get; set; }
        [JsonIgnore]
        public RoomType RoomType { get; set; }
        public int QuantityRoom { get; set; }
        public string QuantityPeople { get; set; }
        public string Detail { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
        public ICollection<RoomImages> RoomImages { get; set; }
    }
}
