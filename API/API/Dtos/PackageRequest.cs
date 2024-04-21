using API.Models;

namespace API.Dtos
{
    public class PackageRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public List<RoomPackageDto>? RoomPackages { get; set; }
        public int? QuantityDay { get; set; }
        public List<SoftpowerPackageDto>? SoftpowerPackages { get; set; }
        public string? QuantityPeople { get; set; }
        public string? Precautions { get; set; }
        public double TotalPrice { get; set; }
        public int Quantity { get; set; }
        public DateTime? Date { get; set; } = DateTime.Now;
    }
    public class RoomPackageDto
    {
        public int? Id { get; set; }
        public int? RoomId { get; set; }
        public int? PackageId { get; set; }
    }
    public class SoftpowerPackageDto
    {
        public int? Id { get; set; }
        public int? SoftpowerId { get; set; }
        public int? PackageId { get; set; }
    }
}
