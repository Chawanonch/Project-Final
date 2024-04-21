using API.Dtos;
using API.Services;
using API.Services.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuildingController : ControllerBase
    {
        private readonly IBuildingService _buildingService;

        public BuildingController(IBuildingService buildingService)
        {
            _buildingService = buildingService;
        }

        [HttpGet("GetBuildings")]
        public async Task<IActionResult> GetBuildings() => Ok(await _buildingService.GetBuildings());

        [HttpGet("GetIdBuilding")]
        public async Task<IActionResult> GetBuilding(int id)
        {
            var result = await _buildingService.GetByIdBuilding(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUBuilding")]
        public async Task<IActionResult> CAUBuilding([FromForm]BuildingRequest request)
        {
            var result = await _buildingService.CAUBuilding(request);
            if (result == null) return BadRequest(result);
            return Ok("Success");
        }

        [HttpDelete("RemoveBuilding")]
        public async Task<IActionResult> RemoveBuilding(int id)
        {
            var result = await _buildingService.RemoveBuilding(id);
            if (result == null) return BadRequest("id not found.");
            return Ok("Success");
        }
    }
}
