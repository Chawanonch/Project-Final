namespace API.Dtos
{
    public class RegisterDto : LoginDto
    {
        public string Username { get; set; }
        public int RoleId { get; set; }
    }
}
