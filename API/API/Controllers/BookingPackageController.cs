using API.Dtos;
using API.Models;
using API.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingPackageController : ControllerBase
    {
        private readonly IBookingPackageService _bookingPackageService;

        public BookingPackageController(IBookingPackageService bookingPackageService)
        {
            _bookingPackageService = bookingPackageService;
        }

        [HttpGet("GetBookingPackages")]
        public async Task<IActionResult> GetBookingPackages() => Ok(await _bookingPackageService.GetBookingPackages());
        [HttpGet("GetBookingPackageByUser"), Authorize]
        public async Task<IActionResult> GetBookingPackageByUser() => Ok(await _bookingPackageService.GetBookingPackageByUser());

        [HttpGet("GetIdBookingPackage")]
        public async Task<IActionResult> GetBookingPackage(int id)
        {
            var result = await _bookingPackageService.GetByIdBookingPackage(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("BookingPackage"), Authorize]
        public async Task<IActionResult> BookingPackage([FromBody] BookingPackageRequest request)
        {
            var result = await _bookingPackageService.BookingPackage(request);
            return Ok(result);
        }
        [HttpDelete("CancelBookingPackage")]
        public async Task<IActionResult> CancelBookingPackage(int id)
        {
            var result = await _bookingPackageService.CancelBookingPackage(id);
            if (result == null) return BadRequest("id not found.");
            return Ok(result);
        }
        [HttpDelete("RemoveManyBookingPackage")]
        public async Task<IActionResult> RemoveManyBookingPackage([FromBody] List<int> ids)
        {
            var result = await _bookingPackageService.RemoveManyBookingPackage(ids);
            return Ok(result);
        }
        [HttpDelete("CheckInUser")]
        public async Task<IActionResult> CheckInUser(int listPackageId)
        {
            var result = await _bookingPackageService.CheckInUser(listPackageId);
            return Ok(result);
        }

        [HttpGet("GetBookingPackagePayments")]
        public async Task<IActionResult> GetBookingPackagePayments() => Ok(await _bookingPackageService.GetBookingPackagePayments());
        [HttpPost("BookingPackagePayment"), Authorize]
        public async Task<IActionResult> BookingPackagePayment([FromForm] BookingPackagePaymentRequest request)
        {
            var result = await _bookingPackageService.BookingPackagePayment(request);
            return Ok(result);
        }

        [HttpDelete("RemoveBookingPackagePayment")]
        public async Task<IActionResult> RemoveBookingPayment(int id)
        {
            var result = await _bookingPackageService.RemoveBookingPackagePayment(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }

    }
}
