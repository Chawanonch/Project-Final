namespace API.Dtos
{
    public class ChangeUserDto
    {
        public int? UserId { get; set; }
        public string? Email { get; set; }
        public string? Username { get; set; }
        public string? Phone { get; set; }
    }
}
