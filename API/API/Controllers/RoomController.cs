using API.Dtos;
using API.Services;
using API.Services.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }
        #region RoomType
        [HttpGet("GetRoomTypes")]
        public async Task<IActionResult> GetRoomTypes() => Ok(await _roomService.GetRoomTypes());

        [HttpGet("GetIdRoomType")]
        public async Task<IActionResult> GetRoomType(int id)
        {
            var result = await _roomService.GetByIdRoomType(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAURoomType")]
        public async Task<IActionResult> CAURoomType([FromForm]RoomTypeRequest request)
        {
            var result = await _roomService.CAURoomType(request);
            if (result == null) return BadRequest(result);
            return Ok("Success");
        }

        [HttpDelete("RemoveRoomType")]
        public async Task<IActionResult> RemoveRoomType(int id)
        {
            var result = await _roomService.RemoveRoomType(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
        #endregion

        #region Room
        [HttpGet("GetRooms")]
        public async Task<IActionResult> GetRooms() => Ok(await _roomService.GetRooms());

        [HttpGet("GetIdRoom")]
        public async Task<IActionResult> GetRoom(int id)
        {
            var result = await _roomService.GetByIdRoom(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAURoom")]
        public async Task<IActionResult> CAURRoom([FromForm] RoomRequest request)
        {
            var result = await _roomService.CAURoom(request);
            return Ok(result);
        }

        [HttpDelete("RemoveRoom")]
        public async Task<IActionResult> RemoveRoom(int id)
        {
            var result = await _roomService.RemoveRoom(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
        #endregion

    }
}
