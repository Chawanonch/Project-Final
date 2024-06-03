using Azure.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using API.Data;
using API.Dtos;
using API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Services.IService;

namespace API.Services
{
    public class AuthenService : IAuthenService
    {
        private readonly Context _context;
        private readonly IConfiguration configuration;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IUploadFileService _uploadFileService;

        public AuthenService(Context context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IUploadFileService uploadFileService)
        {
            _context = context;
            this.configuration = configuration;
            this.httpContextAccessor = httpContextAccessor;
            _uploadFileService = uploadFileService;
        }

        public async Task<List<User>> GetUsers()
        {
            return await _context.Users.Include(x => x.Role).ToListAsync();
        }
        public async Task<List<Role>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }
        public async Task<User> GetUser()
        {
            var email = string.Empty;
            if (httpContextAccessor.HttpContext != null) email = httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);

            var user = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Email == email);
            if (user == null) return null;
            return user;
        }
        public async Task<User> Register(RegisterDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email || x.Username == dto.Username);
            if (user != null) return null;

            var role = await _context.Roles.FirstOrDefaultAsync(x => x.Id == dto.RoleId);
            if (role == null) return null;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var User = new User()
            {
                Email = dto.Email,
                Username = dto.Username,
                PasswordHash = passwordHash,
                RoleId = dto.RoleId,
            };
            await _context.Users.AddAsync(User);
            await _context.SaveChangesAsync();
            return User;
        }
        public async Task<string> Login(LoginDto dto)
        {
            var user = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Username == dto.Email || x.Email == dto.Email || x.Phone == dto.Email);
            if (user == null) return null;

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return null;

            string token = CreateToken(user);
            return token;
        }
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name),
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                configuration.GetSection("JWTSettings:TokenKey").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(7),
                    signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public async Task<bool> IsTokenExpired(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            if (jwtToken == null)
            {
                return true; // Token ไม่ถูกต้องหรือไม่สามารถอ่านได้
            }

            var expiryDateUnix =
                long.Parse(jwtToken.Claims.FirstOrDefault(x => x.Type == "exp")?.Value);

            var expiryDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                .AddSeconds(expiryDateUnix);

            if (expiryDateTimeUtc > DateTime.UtcNow)
            {
                return false; // Token ยังไม่หมดอายุ
            }

            return true; // Token หมดอายุ
        }

        public async Task<object> GetUserDetail()
        {
            var id = 0;
            var username = string.Empty;
            var role = string.Empty;
            var image = string.Empty;
            var email = string.Empty;
            var phone = string.Empty;

            var user = await GetUser();
            if (user == null) return "user not found.";

            if (httpContextAccessor.HttpContext != null)
            {
                id = user.Id;
                username = user.Username;
                role = user.Role.Name;
                image = user.Image;
                email = user.Email;
                phone = user.Phone;
            }
            return new { id, username, role, image, email, phone };
        }
        public async Task<object> ChangeUser(ChangeUserDto dto)
        {
            #region user
            var email = string.Empty;
            if (dto.UserId != null)
            {
                var userById = await _context.Users.FirstOrDefaultAsync(x => x.Id == dto.UserId);
                if (userById == null) return "User not found.";
                email = userById.Email;
            }
            else if (httpContextAccessor.HttpContext != null)
            {
                var users = httpContextAccessor.HttpContext.User;
                if (users != null) email = users.FindFirstValue(ClaimTypes.Email);

                if (string.IsNullOrEmpty(email)) return "Email not found in HttpContext.";
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null) return null;
            #endregion

            user.Email = dto?.Email;
            user.Username = dto?.Username;
            user.Phone = dto?.Phone;

            await _context.SaveChangesAsync();
            return "Change Success!";
        }
        public async Task<object> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);
            if (user == null) return null;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            user.PasswordHash = passwordHash;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return passwordHash;
        }

        public async Task<object> AddImageUser(AddImageUserDto dto)
        {
            (string errorMessage, string imageName) = await _uploadFileService.UploadImageAsync(dto.Image);
            if (!string.IsNullOrEmpty(errorMessage)) return errorMessage;

            var user = await GetUser();
            if (user == null) return "user not found.";
            //ถ้ามีรูปอยู่แล้วให้ลบก่อน
            if (user.Image != "") await _uploadFileService.DeleteFileImage(user.Image);
            user.Image = imageName;
            await _context.SaveChangesAsync();
            return "Add Image Success!";
        }

        public async Task<object> RemoveUser(int id)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (user == null) return null;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            if(user.Image != null) await _uploadFileService.DeleteFileImage(user.Image);
            return "success";
        }
    }
}
