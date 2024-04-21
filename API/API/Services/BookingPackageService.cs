using API.Data;
using API.Dtos;
using API.Models;
using API.Services.IService;
using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System.Security.Claims;

namespace API.Services
{
    public class BookingPackageService : IBookingPackageService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IPackageService _packageService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;

        public BookingPackageService(Context context, IMapper mapper, IPackageService packageService, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _packageService = packageService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }
        public async Task<List<BookingPackage>> GetBookingPackages()
        {
            return await _context.BookingPackages
                .Include(x => x.User)
                .Include(x => x.ListPackages)
                .ToListAsync();
        }
        public async Task<List<BookingPackage>> GetBookingPackageByUser()
        {
            var email = string.Empty;
            if (_httpContextAccessor.HttpContext != null) email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);

            return await _context.BookingPackages
                .Include(x => x.User)
                .Include(x => x.ListPackages)
                .Where(x => x.User.Email == email)
                .OrderByDescending(x => x.Id)
                .ToListAsync();
        }
        public async Task<BookingPackage> GetByIdBookingPackage(int? id)
        {
            var bookingPackage = await _context.BookingPackages.Include(x => x.ListPackages).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (bookingPackage == null) return null;
            else return bookingPackage;
        }
        public async Task<object> BookingPackage(BookingPackageRequest request)
        {
            #region user
            var email = string.Empty;
            if (request.UserId != null)
            {
                var userById = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId);
                if (userById == null) return "User not found.";
                email = userById.Email;
            }
            else if (_httpContextAccessor.HttpContext != null)
            {
                var users = _httpContextAccessor.HttpContext.User;
                if (users != null) email = users.FindFirstValue(ClaimTypes.Email);

                if (string.IsNullOrEmpty(email)) return "Email not found in HttpContext.";
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null) return "User not found.";
            #endregion

            var result = _mapper.Map<BookingPackage>(request);

            result.UserId = user.Id;

            if (request.ListPackages.Count() > 0)
            {
                foreach (var packageDto in request.ListPackages)
                {
                    var packageEntity = await _packageService.GetByIdPackage(packageDto.PackageId);
                    if (packageEntity == null) result.ListPackages.Clear();
                }
            }

            var bookingPackage = await GetByIdBookingPackage(request?.Id);
            result.TotalPriceBookingPackage = 0;

            if (bookingPackage == null) await _context.BookingPackages.AddAsync(result);
            else _context.BookingPackages.Update(result);
            await _context.SaveChangesAsync();

            if (request.ListPackages.Count() > 0)
            {
                var bookingPackages = await _context.ListPackages.Where(x => x.BookingPackageId == result.Id).ToListAsync();
                if (bookingPackages.Any())
                {
                    _context.ListPackages.RemoveRange(bookingPackages);
                    await _context.SaveChangesAsync();
                }

                var listPackage = new List<ListPackage>();

                foreach (var packagesDTO in request.ListPackages)
                {
                    var packageEntity = await _packageService.GetByIdPackage(packagesDTO.PackageId);
                    if (packageEntity == null) return "id package not found!";

                    var numberY = bookingPackage == null ? 543 : 0;
                    var numberHs = bookingPackage == null ? 12.50 : 0;
                    var numberHe = bookingPackage == null ? 10.50 : 0;

                    var newListPackage = new ListPackage
                    {
                        BookingPackageId = result.Id,
                        PackageId = packagesDTO.PackageId,
                        Quantity = packagesDTO.Quantity,
                        Start = packagesDTO.Start.AddYears(numberY).AddHours(numberHs),
                        End = packagesDTO.Start.AddDays(packageEntity.QuantityDay).AddYears(numberY).AddHours(numberHe),
                    };

                    listPackage.Add(newListPackage);
                    result.TotalPriceBookingPackage += packageEntity.TotalPrice * packagesDTO.Quantity;
                }

                result.ListPackages = listPackage;
                _context.BookingPackages.Update(result);
                await _context.ListPackages.AddRangeAsync(listPackage);
                await _context.SaveChangesAsync();
            }

            return result;
        }
        public async Task<object> CancelBookingPackage(int id)
        {
            var bookingPackage = await _context.BookingPackages.Include(x => x.ListPackages).FirstOrDefaultAsync(x => x.Id == id);
            if (bookingPackage == null) return "Booking error.";

            if (bookingPackage.Status == StatusBooking.PaymentDepositCompleted || bookingPackage.Status == StatusBooking.PaymentCompleted)
            {
                if (bookingPackage.ListPackages.Count() > 0)
                {
                    foreach (var packageDto in bookingPackage.ListPackages)
                    {
                        var packageEntity = await _context.Packages.FindAsync(packageDto.PackageId);
                        if (packageEntity == null) return "id package not found!";
                        packageEntity.Quantity += packageDto.Quantity;
                        _context.Packages.Update(packageEntity);
                        await _context.SaveChangesAsync();
                    }
                }
            }
            bookingPackage.Status = StatusBooking.PaymentCancel;
            await _context.SaveChangesAsync();
            return "Change Status Success";
        }

        public async Task<object> RemoveManyBookingPackage(List<int> ids)
        {
            var bookingPackagesToRemove = await _context.BookingPackages
                .Include(x => x.ListPackages)
                .Where(b => ids.Contains(b.Id))
                .ToListAsync();
            if (bookingPackagesToRemove == null) return null;

            var packagesToRemove = new List<ListPackage>();

            foreach (var bookingPackage in bookingPackagesToRemove)
            {
                if (bookingPackage.Status == StatusBooking.PaymentDepositCompleted || bookingPackage.Status == StatusBooking.PaymentCompleted)
                {
                    return "Remove error";
                }
                else
                {
                    foreach (var package in bookingPackage.ListPackages)
                    {
                        var packages = await _context.ListPackages
                            .Where(x => x.Id.Equals(package.Id))
                            .ToListAsync();
                        packagesToRemove.AddRange(packages);
                    }
                }
            }

            if (packagesToRemove.Any())
            {
                _context.ListPackages.RemoveRange(packagesToRemove);
                await _context.SaveChangesAsync();
            }

            _context.BookingPackages.RemoveRange(bookingPackagesToRemove);
            await _context.SaveChangesAsync();

            return "Remove Many BookingPackage !";
        }

        public async Task<object> CheckInUser(int listPackageId)
        {
            var listPackage = await _context.ListPackages.FirstOrDefaultAsync(x => x.Id == listPackageId);
            if(listPackage == null) return "listPackage error.";
            if (listPackage.CheckInDate == StatusCheckIn.NotCome) listPackage.CheckInDate = StatusCheckIn.Come;
            else listPackage.CheckInDate = StatusCheckIn.NotCome;

            listPackage.CheckInTime = DateTime.Now.AddYears(543);
            await _context.SaveChangesAsync();

            return "CheckIn Success";
        }

        public async Task<List<BookingPackagePayment>> GetBookingPackagePayments()
        {
            return await _context.BookingPackagePayments
                .Include(x => x.BookingPackage)
                .ThenInclude(x => x.ListPackages)
                .ToListAsync();
        }
        public async Task<BookingPackagePayment> GetByIdBookingPackagePayment(int? id)
        {
            var bookingPackagePayment = await _context.BookingPackagePayments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (bookingPackagePayment == null) return null;
            else return bookingPackagePayment;
        }
        public async Task<object> BookingPackagePayment(BookingPackagePaymentRequest request)
        {
            var result = _mapper.Map<BookingPackagePayment>(request);

            var booking = await GetByIdBookingPackage(request.BookingPackageId);
            if (booking == null) return "BookingId not found!";
            result.PaymentDate = DateTime.Now;
            var bookingPayment = await GetByIdBookingPackagePayment(request?.Id);
            if (bookingPayment == null) await _context.BookingPackagePayments.AddAsync(result);
            else
            {
                if (bookingPayment.PaymentIntentId0 != null && bookingPayment.ClientSecret0 != null)
                {
                    result.PaymentIntentId0 = bookingPayment.PaymentIntentId0;
                    result.ClientSecret0 = bookingPayment.ClientSecret0;
                }

                _context.BookingPackagePayments.Update(result);
            }

            var saveResult = await _context.SaveChangesAsync();
            if (saveResult > 0)
            {
                if (booking.Status != StatusBooking.PaymentCompleted)
                {
                    long price = (long)booking.TotalPriceBookingPackage;

                    var intent = await CreatePaymentIntent(result, price, booking);
                    if (!string.IsNullOrEmpty(intent.Id))
                    {
                        var confirmResult = await ConfirmPaymentIntent(intent.Id);
                        var booking1 = await _context.BookingPackages.Include(x => x.ListPackages).ThenInclude(x => x.Package).FirstOrDefaultAsync(x => x.Id == booking.Id);
                        foreach (var item in booking1.ListPackages)
                        {
                            var packageEntity = await _context.Packages.FindAsync(item.PackageId);
                            if (packageEntity == null) return "package error.";
                            if (booking1 == null) return null;

                            if (result.Status == StatusBookingPayment.Deposit)
                            {
                                result.PaymentIntentId0 = intent.Id;
                                result.ClientSecret0 = intent.ClientSecret;
                                booking1.Status = StatusBooking.PaymentDepositCompleted;
                                result.Status = StatusBookingPayment.Deposit;
                                if (item.Quantity >= packageEntity.Quantity)
                                {
                                    packageEntity.Quantity = 0;
                                }
                                else packageEntity.Quantity -= item.Quantity;
                            }
                            else if (result.Status == StatusBookingPayment.RemainingAmount && booking.Status == StatusBooking.PaymentDepositCompleted)
                            {
                                result.PaymentIntentId1 = intent.Id;
                                result.ClientSecret1 = intent.ClientSecret;
                                booking1.Status = StatusBooking.PaymentCompleted;
                                result.Status = StatusBookingPayment.RemainingAmount;
                            }
                            else
                            {
                                result.PaymentIntentId2 = intent.Id;
                                result.ClientSecret2 = intent.ClientSecret;
                                booking1.Status = StatusBooking.PaymentCompleted;
                                result.Status = StatusBookingPayment.FullAmount;
                                if (item.Quantity >= packageEntity.Quantity)
                                {
                                    packageEntity.Quantity = 0;
                                }
                                else packageEntity.Quantity -= item.Quantity;
                            }
                        };
                        await _context.SaveChangesAsync();
                    }
                }
            }
            return "Payment Success";
        }
        private async Task<PaymentIntent> CreatePaymentIntent(BookingPackagePayment result, long price, BookingPackage booking)
        {
            StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];
            var service = new PaymentIntentService();
            var intent = new PaymentIntent();

            if (result.Status == StatusBookingPayment.Deposit)
            {
                price = price * 35 / 100;
            }
            else if (result.Status == StatusBookingPayment.RemainingAmount && booking.Status == StatusBooking.PaymentDepositCompleted)
            {
                price = price * 65 / 100;
            }

            //สร้างรายการใหม่
            if (string.IsNullOrEmpty(result.PaymentIntentId0) || string.IsNullOrEmpty(result.PaymentIntentId1) || string.IsNullOrEmpty(result.PaymentIntentId2))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = price * 100, // ยอดเงินเท่าไร
                    Currency = "THB", // สกุลเงิน 
                    PaymentMethodTypes = new List<string> { "card" } // วิธีการจ่าย
                };
                intent = await service.CreateAsync(options); // รหัสใบส่งของ
            };

            return intent; // ส่งใบส่งของออกไป
        }
        private async Task<PaymentIntent> ConfirmPaymentIntent(string paymentIntentId)
        {
            StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];

            var confirmOptions = new PaymentIntentConfirmOptions
            {
                PaymentMethod = "pm_card_visa",
                ReturnUrl = "https://www.example.com",
            };

            var service = new PaymentIntentService();
            return await service.ConfirmAsync(paymentIntentId, confirmOptions);
        }
        public async Task<object> RemoveBookingPackagePayment(int id)
        {
            var bookingPayment = await GetByIdBookingPackagePayment(id);
            if (bookingPayment == null) return null;

            _context.BookingPackagePayments.Remove(bookingPayment);
            await _context.SaveChangesAsync();
            return bookingPayment;
        }
    }
}
