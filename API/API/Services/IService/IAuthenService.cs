using API.Dtos;
using API.Models;

namespace API.Services.IService
{
    public interface IAuthenService
    {
        Task<List<User>> GetUsers();
        Task<List<Role>> GetRoles();
        Task<User> Register(RegisterDto dto);
        Task<string> Login(LoginDto dto);
        Task<Object> GetUserDetail();
        Task<User> GetUser();
        Task<Object> ChangeUser(ChangeUserDto dto);
        Task<Object> AddImageUser(AddImageUserDto dto);
        Task<Object> ForgotPassword(ForgotPasswordDto dto);
        Task<Object> RemoveUser(int id);

        Task<bool> IsTokenExpired(string token);

    }
}
