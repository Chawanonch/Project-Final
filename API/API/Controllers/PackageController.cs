using API.Dtos;
using API.Services.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackageController : ControllerBase
    {
        private readonly IPackageService _packageService;

        public PackageController(IPackageService packageService)
        {
            _packageService = packageService;
        }

        [HttpGet("GetPackages")]
        public async Task<IActionResult> GetPackages() => Ok(await _packageService.GetPackages());

        [HttpGet("GetIdPackage")]
        public async Task<IActionResult> GetPackage(int id)
        {
            var result = await _packageService.GetByIdPackage(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUPackage")]
        public async Task<IActionResult> CAUPackage([FromBody] PackageRequest request)
        {
            var result = await _packageService.CAUPackage(request);
            return Ok(result);
        }

        [HttpDelete("RemovePackage")]
        public async Task<IActionResult> RemovePackage(int id)
        {
            var result = await _packageService.RemovePackage(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
