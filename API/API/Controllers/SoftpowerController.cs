using API.Dtos;
using API.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SoftpowerController : ControllerBase
    {
        private readonly ISoftpowerService _softpowerService;

        public SoftpowerController(ISoftpowerService softpowerService)
        {
            _softpowerService = softpowerService;
        }

        #region SoftpowerType
        [HttpGet("GetSoftpowerTypes")]
        public async Task<IActionResult> GetSoftpowerTypes() => Ok(await _softpowerService.GetSoftpowerTypes());

        [HttpGet("GetIdSoftpowerType")]
        public async Task<IActionResult> GetSoftpowerType(int id)
        {
            var result = await _softpowerService.GetByIdSoftpowerType(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUSoftpowerType")]
        public async Task<IActionResult> CAUSoftpowerType([FromForm] SoftpowerTypeRequest request)
        {
            var result = await _softpowerService.CAUSoftpowerType(request);
            if (result == null) return BadRequest(result);
            return Ok("Success");
        }

        [HttpDelete("RemoveSoftpowerType")]
        public async Task<IActionResult> RemoveSoftpowerType(int id)
        {
            var result = await _softpowerService.RemoveSoftpowerType(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
        #endregion

        #region Softpower
        [HttpGet("GetSoftpowers")]
        public async Task<IActionResult> GetSoftpowers() => Ok(await _softpowerService.GetSoftpowers());

        [HttpGet("GetIdSoftpower")]
        public async Task<IActionResult> GetSoftpower(int id)
        {
            var result = await _softpowerService.GetByIdSoftpower(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUSoftpower")]
        public async Task<IActionResult> CAUSoftpower([FromForm] SoftpowerRequest request)
        {
            var result = await _softpowerService.CAUSoftpower(request);
            return Ok(result);
        }

        [HttpDelete("RemoveSoftpower")]
        public async Task<IActionResult> RemoveSoftpower(int id)
        {
            var result = await _softpowerService.RemoveSoftpower(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
        #endregion
    }
}
