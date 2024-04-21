using API.Dtos;
using API.Models;

namespace API.Services.IService
{
    public interface IBookingPackageService
    {
        Task<List<BookingPackage>> GetBookingPackages();
        Task<List<BookingPackage>> GetBookingPackageByUser();
        Task<BookingPackage> GetByIdBookingPackage(int? id);
        Task<object> BookingPackage(BookingPackageRequest request);
        Task<object> CancelBookingPackage(int id);
        Task<object> RemoveManyBookingPackage(List<int> ids);
        Task<object> CheckInUser(int listPackageId);

        Task<List<BookingPackagePayment>> GetBookingPackagePayments();
        Task<BookingPackagePayment> GetByIdBookingPackagePayment(int? id);
        Task<object> BookingPackagePayment(BookingPackagePaymentRequest request);
        Task<object> RemoveBookingPackagePayment(int id);
    }
}
