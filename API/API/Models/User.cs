using System.Text.Json.Serialization;

namespace API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? Image { get; set; } = string.Empty;
        public int RoleId { get; set; }
        [JsonIgnore]
        public Role Role { get; set; }
    }
}
