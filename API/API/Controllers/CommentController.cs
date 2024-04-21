using API.Dtos;
using API.Services.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("GetComments")]
        public async Task<IActionResult> GetComments() => Ok(await _commentService.GetComments());

        [HttpGet("GetIdComment")]
        public async Task<IActionResult> GetComment(int id)
        {
            var result = await _commentService.GetByIdComment(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUComment")]
        public async Task<IActionResult> CAURComment([FromForm] CommentRequest request)
        {
            var result = await _commentService.CAUComment(request);
            return Ok(result);
        }

        [HttpDelete("RemoveComment")]
        public async Task<IActionResult> RemoveComment(int id)
        {
            var result = await _commentService.RemoveComment(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }

        [HttpGet("GetCommentPackages")]
        public async Task<IActionResult> GetCommentPackages() => Ok(await _commentService.GetCommentPackages());

        [HttpGet("GetIdCommentPackage")]
        public async Task<IActionResult> GetCommentPackage(int id)
        {
            var result = await _commentService.GetByIdCommentPackage(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUCommentPackage")]
        public async Task<IActionResult> CAURCommentPackage([FromForm] CommentPackageRequest request)
        {
            var result = await _commentService.CAUCommentPackage(request);
            return Ok(result);
        }

        [HttpDelete("RemoveCommentPackage")]
        public async Task<IActionResult> RemoveCommentPackage(int id)
        {
            var result = await _commentService.RemoveCommentPackage(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
