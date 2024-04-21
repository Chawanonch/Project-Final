using System.Text.Json.Serialization;

namespace API.Models
{
    public class Package
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<RoomPackage> RoomPackages { get; set; }
        public int QuantityDay { get; set; }
        public List<SoftpowerPackage> SoftpowerPackages { get; set; }
        public string QuantityPeople { get; set; }
        public string Precautions { get; set; }
        public double TotalPrice { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
    }
    public class RoomPackage
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        [JsonIgnore]
        public Room Room { get; set; }
        public int PackageId { get; set; }
        [JsonIgnore]
        public Package Package { get; set; }
    }
    public class SoftpowerPackage
    {
        public int Id { get; set; }
        public int SoftpowerId { get; set; }
        [JsonIgnore]
        public Softpower Softpower { get; set; }
        public int PackageId { get; set; }
        [JsonIgnore]
        public Package Package { get; set; }
    }
}
