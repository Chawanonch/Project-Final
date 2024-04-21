using API.Dtos;
using API.Models;

namespace API.Services.IService
{
    public interface IBookingRoomService
    {
        Task<List<Booking>> GetBookings();
        Task<List<Booking>> GetBookingByUser();
        Task<Booking> GetByIdBooking(int? id);
        Task<object> Booking(BookingRequest request);
        Task<object> CancelBooking(int id);
        Task<object> RemoveManyBooking(List<int> ids);

        Task<List<BookingPayment>> GetBookingPayments();
        Task<BookingPayment> GetByIdBookingPayment(int? id);
        Task<object> BookingPayment(BookingPaymentRequest request);
        //Task<object> ChangeStatus(int id);
        Task<object> CheckInUser(int id);
        Task<object> RemoveBookingPayment(int id);

    }
}
