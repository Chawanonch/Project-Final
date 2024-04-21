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
    public class BookingController : ControllerBase
    {
        private readonly IBookingRoomService _bookingService;

        public BookingController(IBookingRoomService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet("GetBookings")]
        public async Task<IActionResult> GetBookings() => Ok(await _bookingService.GetBookings());
        [HttpGet("GetBookingByUser"), Authorize]
        public async Task<IActionResult> GetBookingByUser() => Ok(await _bookingService.GetBookingByUser());

        [HttpGet("GetIdBooking")]
        public async Task<IActionResult> GetBooking(int id)
        {
            var result = await _bookingService.GetByIdBooking(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("Booking"), Authorize]
        public async Task<IActionResult> Booking([FromBody] BookingRequest request)
        {
            var result = await _bookingService.Booking(request);
            return Ok(result);
        }
        [HttpDelete("CancelBooking")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var result = await _bookingService.CancelBooking(id);
            if (result == null) return BadRequest("id not found.");
            return Ok(result);
        }
        [HttpDelete("RemoveManyBooking")]
        public async Task<IActionResult> RemoveManyBooking([FromBody] List<int> ids)
        {
            var result = await _bookingService.RemoveManyBooking(ids);
            return Ok(result);
        }
        [HttpGet("GetBookingPayments")]
        public async Task<IActionResult> GetBookingPayments() => Ok(await _bookingService.GetBookingPayments());
        [HttpPost("BookingPayment"), Authorize]
        public async Task<IActionResult> BookingPayment([FromForm] BookingPaymentRequest request)
        {
            var result = await _bookingService.BookingPayment(request);
            return Ok(result);
        }
        [HttpDelete("CheckInUser")]
        public async Task<IActionResult> CheckInUser(int id)
        {
            var result = await _bookingService.CheckInUser(id);
            return Ok(result);
        }
        //[HttpDelete("ChangeStatus"), Authorize]
        //public async Task<IActionResult> ChangeStatus(int bookingPaymentId)
        //{
        //    var result = await _bookingService.ChangeStatus(bookingPaymentId);
        //    return Ok(result);
        //}
        [HttpDelete("RemoveBookingPayment")]
        public async Task<IActionResult> RemoveBookingPayment(int id)
        {
            var result = await _bookingService.RemoveBookingPayment(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
