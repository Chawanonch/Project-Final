using API.Models;

namespace API.Dtos
{
    public class RoomRequest
    {
        public int? Id { get; set; }
        public int BuildingId { get; set; }
        public int RoomTypeId { get; set; }
        public int QuantityRoom { get; set; }
        public string? QuantityPeople { get; set; }
        public string? Detail { get; set; } = string.Empty;
        public double Price { get; set; }
        public IFormFile? Image { get; set; }
        public IFormFileCollection? Images { get; set; }
    }
}
