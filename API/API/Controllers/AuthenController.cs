using API.Dtos;
using API.Services;
using API.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenController : ControllerBase
    {
        private readonly IAuthenService _authenService;

        public AuthenController(IAuthenService authenService)
        {
            _authenService = authenService;
        }

        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers() => Ok(await _authenService.GetUsers());
        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles() => Ok(await _authenService.GetRoles());

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = await _authenService.Register(dto);
            if (user == null) return BadRequest("user or role or email already exists");
            return Ok(user);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authenService.Login(dto);
            if (result == null) return BadRequest("Email or password not found.");
            return Ok(result);
        }

        [HttpGet("GetUserDetail"),Authorize]
        public async Task<IActionResult> GetUserDetail() =>
            Ok(await _authenService.GetUserDetail());

        [HttpPost("ChangeUser"), Authorize]
        public async Task<IActionResult> ChangeUser([FromForm] ChangeUserDto dto) =>
            Ok(await _authenService.ChangeUser(dto));

        [HttpPost("AddImageUser"), Authorize]
        public async Task<IActionResult> AddImageUser([FromForm] AddImageUserDto dto) =>
            Ok(await _authenService.AddImageUser(dto));

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto) =>
            Ok(await _authenService.ForgotPassword(dto));

        [HttpDelete("RemoveUser")]
        public async Task<IActionResult> RemoveUser(int id)
        {
            var result = await _authenService.RemoveUser(id);
            if (result == null) return BadRequest("id not found.");
            return Ok("Success");
        }

        [HttpDelete("IsTokenExpired")]
        public async Task<IActionResult> IsTokenExpired(string token)
        {
            var result = await _authenService.IsTokenExpired(token);
            return Ok(result);
        }
    }
}
