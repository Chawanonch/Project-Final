using System.Text.Json.Serialization;

namespace API.Models
{
    public class Softpower
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImportantName { get; set; }
        public string WhatIs { get; set; }
        public string Origin { get; set; }
        public string Refer { get; set; }
        public int SoftpowerTypeId { get; set; }
        [JsonIgnore]
        public SoftpowerType SoftpowerType { get; set; }
        public string Image { get; set; }
        public ICollection<SoftpowerImages> SoftpowerImages { get; set; }
    }
}
