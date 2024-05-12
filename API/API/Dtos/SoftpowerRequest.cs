namespace API.Dtos
{
    public class SoftpowerRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string? WhatIs { get; set; }
        public string? ImportantName { get; set; }
        public string? Origin { get; set; }
        public string? ValueSoftpower { get; set; }
        public string? PromoteSoftpower { get; set; }
        public string? Refer { get; set; }
        public int SoftpowerTypeId { get; set; }
        public IFormFile? Image { get; set; }
        public IFormFileCollection? Images { get; set; }
    }
}
