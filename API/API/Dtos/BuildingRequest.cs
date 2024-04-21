namespace API.Dtos
{
    public class BuildingRequest
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }
        public IFormFile? Image { get; set; }

    }
}
