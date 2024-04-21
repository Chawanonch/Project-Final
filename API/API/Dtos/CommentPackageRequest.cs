namespace API.Dtos
{
    public class CommentPackageRequest
    {
        public int? Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public double Star { get; set; }
        public int BookingPackageId { get; set; }
        public IFormFileCollection? Images { get; set; }
    }
}
