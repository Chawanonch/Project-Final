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
    public class BookingRoomService : IBookingRoomService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IRoomService _roomService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;

        public BookingRoomService(Context context, IMapper mapper, IRoomService roomService, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _roomService = roomService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }
        public async Task<List<Booking>> GetBookings()
        {
            return await _context.Booking
                .Include(x => x.User)
                .Include(x => x.ListRooms).ThenInclude(x => x.Room)
                .ToListAsync();
        }
        public async Task<List<Booking>> GetBookingByUser()
        {
            var email = string.Empty;
            if (_httpContextAccessor.HttpContext != null) email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);

            return await _context.Booking
                .Include(x => x.User)
                .Include(x => x.ListRooms)
                .Where(x => x.User.Email == email)
                .OrderByDescending(x => x.Id)
                .ToListAsync();
        }
        public async Task<Booking> GetByIdBooking(int? id)
        {
            var booking = await _context.Booking.Include(x => x.ListRooms).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (booking == null) return null;
            else return booking;
        }
        public async Task<object> Booking(BookingRequest request)
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

            if (request.Start > request.End) return "Error Date : Start > End";

            var result = _mapper.Map<Booking>(request);

            if (request.ListRooms.Count() > 0)
            {
                foreach (var roomDto in request.ListRooms)
                {
                    var roomEntity = await _roomService.GetByIdRoom(roomDto.RoomId);
                    if (roomEntity == null) result.ListRooms.Clear();
                }
            }

            var booking = await GetByIdBooking(request?.Id);
            var numberY = booking == null ? 543 : 0;
            var numberHs = booking == null ? 12.50 : 0;
            var numberHe = booking == null ? 10.50 : 0;

            result.Start = result.Start.Date.AddYears(numberY).AddHours(numberHs);
            result.End = result.End.Date.AddYears(numberY).AddHours(numberHe);
            result.UserId = user.Id;

            if (result.Start.Day == result.End.Day) return "Error Day Start = End";

            TimeSpan difference = result.End.Date - result.Start.Date;
            int daysDifference = difference.Days;

            if (booking == null) await _context.Booking.AddAsync(result);
            else _context.Booking.Update(result);

            await _context.SaveChangesAsync();

            if (request.ListRooms.Count() > 0)
            {
                var bookings = await _context.ListRooms.Where(x => x.BookingId == result.Id).ToListAsync();
                if (bookings.Any())
                {
                    _context.ListRooms.RemoveRange(bookings);
                    await _context.SaveChangesAsync();
                }

                var listRoom = new List<ListRoom>();

                foreach (var roomsDTO in request.ListRooms)
                {
                    var roomEntity = await _roomService.GetByIdRoom(roomsDTO.RoomId);
                    if (roomEntity == null) return "id package not found!";
                    var newListRoom = new ListRoom
                    {
                        BookingId = result.Id,
                        RoomId = roomsDTO.RoomId,
                        QuantityRoom = roomsDTO.QuantityRoom,
                        QuantityRoomExcess = roomsDTO.QuantityRoomExcess ?? 0,
                    };

                    listRoom.Add(newListRoom);

                    result.TotalPrice += roomEntity.Price * roomsDTO.QuantityRoom;
                }
                result.TotalPrice *= daysDifference;
                result.ListRooms = listRoom;
                _context.Booking.Update(result);
                await _context.ListRooms.AddRangeAsync(listRoom);
                await _context.SaveChangesAsync();
            }

            return result;
        }

        public async Task<List<BookingPayment>> GetBookingPayments()
        {
            return await _context.BookingPayments
                .Include(x => x.Booking)
                .ThenInclude(x => x.ListRooms)
                .ToListAsync();
        }
        public async Task<BookingPayment> GetByIdBookingPayment(int? id)
        {
            var bookingPayment = await _context.BookingPayments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (bookingPayment == null) return null;
            else return bookingPayment;
        }
        public async Task<object> BookingPayment(BookingPaymentRequest request)
        {
            var result = _mapper.Map<BookingPayment>(request);

            var booking = await GetByIdBooking(request.BookingId);
            if (booking == null) return "BookingId not found!";
            result.PaymentDate = DateTime.Now;
            var bookingPayment = await GetByIdBookingPayment(request?.Id);
            if (bookingPayment == null) await _context.BookingPayments.AddAsync(result);
            else
            {
                if (bookingPayment.PaymentIntentId0 != null && bookingPayment.ClientSecret0 != null)
                {
                    result.PaymentIntentId0 = bookingPayment.PaymentIntentId0;
                    result.ClientSecret0 = bookingPayment.ClientSecret0;
                }

                _context.BookingPayments.Update(result);
            }

            var saveResult = await _context.SaveChangesAsync();
            if (saveResult > 0)
            {
                if (booking.Status != StatusBooking.PaymentCompleted)
                {
                    long price = (long)booking.TotalPrice;

                    var intent = await CreatePaymentIntent(result, price, booking);
                    if (!string.IsNullOrEmpty(intent.Id))
                    {
                        var confirmResult = await ConfirmPaymentIntent(intent.Id);
                        var booking1 = await _context.Booking.Include(x => x.ListRooms).ThenInclude(x => x.Room).FirstOrDefaultAsync(x => x.Id == booking.Id);
                        foreach (var item in booking1.ListRooms)
                        {
                            var roomEntity = await _context.Rooms.FindAsync(item.RoomId);
                            if (roomEntity == null) return "room error.";
                            if (booking1 == null) return null;
                            if (result.Status == StatusBookingPayment.Deposit)
                            {
                                result.PaymentIntentId0 = intent.Id;
                                result.ClientSecret0 = intent.ClientSecret;
                                booking1.Status = StatusBooking.PaymentDepositCompleted;
                                result.Status = StatusBookingPayment.Deposit;
                                if (item.QuantityRoom >= roomEntity.QuantityRoom)
                                {
                                    roomEntity.QuantityRoom = 0;
                                }
                                else roomEntity.QuantityRoom -= item.QuantityRoom - item.QuantityRoomExcess;
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
                                if (item.QuantityRoom >= roomEntity.QuantityRoom)
                                {
                                    roomEntity.QuantityRoom = 0;
                                }
                                else roomEntity.QuantityRoom -= item.QuantityRoom - item.QuantityRoomExcess;
                            }
                        };
                        await _context.SaveChangesAsync();

                    };
                }
            }
            return "Payment Success";
        }
        private async Task<PaymentIntent> CreatePaymentIntent(BookingPayment result, long price, Booking booking)
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

        //public async Task<object> ChangeStatus(int bookingPaymentId)
        //{
        //    var bookingPayment = await _context.BookingPayments.FindAsync(bookingPaymentId);
        //    if (bookingPayment == null) return "Id not found.";

        //    var booking = await _context.Booking.Include(x => x.Room).FirstOrDefaultAsync(x => x.Id == bookingPayment.BookingId);
        //    if (booking == null) return "Booking error.";

        //    if(bookingPayment.Status == StatusBookingPayment.Deposit)
        //    {
        //        booking.Status = StatusBooking.PaymentDepositCompleted;
        //        var roomEntity = await _context.Rooms.FindAsync(booking.RoomId);
        //        if (roomEntity == null) return "room error.";
        //        roomEntity.QuantityRoom -= booking.QuantityRoom;

        //        if (roomEntity.QuantityRoom < 0) return "Error QuantityRoom";

        //        _context.Rooms.Update(roomEntity);
        //        await _context.SaveChangesAsync();
        //    }
        //    //ถ้า ป้อนจำนวนที่เหลือที่หมด หรือ ป้อนเต็มจำนวนจะเปลี่ยนเป็นสถานะนี้
        //    else
        //    {
        //        booking.Status = StatusBooking.PaymentCompleted;

        //        if(bookingPayment.Status == StatusBookingPayment.FullAmount)
        //        {
        //            var roomEntity = await _context.Rooms.FindAsync(booking.RoomId);
        //            if (roomEntity == null) return "room error.";
        //            roomEntity.QuantityRoom -= booking.QuantityRoom;

        //            if (roomEntity.QuantityRoom < 0) return "Error QuantityRoom";

        //            _context.Rooms.Update(roomEntity);
        //        }
        //        await _context.SaveChangesAsync();
        //    }
        //    return "Change Status Success";
        //}
        public async Task<object> CheckInUser(int id)
        {
            var booking = await _context.Booking.Include(x => x.ListRooms).FirstOrDefaultAsync(x => x.Id == id);
            if (booking == null) return "Booking error.";

            if (booking.StatusCheckIn == StatusCheckIn.NotCome) booking.StatusCheckIn = StatusCheckIn.Come;
            else booking.StatusCheckIn = StatusCheckIn.NotCome;

            booking.CheckInTime = DateTime.Now.AddYears(543);
            await _context.SaveChangesAsync();
            return "CheckIn Success";
        }
        public async Task<object> CancelBooking(int id)
        {
            var booking = await _context.Booking.Include(x => x.ListRooms).FirstOrDefaultAsync(x => x.Id == id);
            if (booking == null) return "Booking error.";

            if (booking.Status == StatusBooking.PaymentDepositCompleted || booking.Status == StatusBooking.PaymentCompleted)
            {
                if (booking.ListRooms.Count() > 0)
                {
                    if (booking.Status == StatusBooking.PaymentCompleted)
                    {
                        var payment = await _context.BookingPayments.FirstOrDefaultAsync(x => x.BookingId == booking.Id);
                        if (payment == null) return null;

                        if (payment.PaymentIntentId1 != "" || payment.PaymentIntentId2 != "")
                        {
                            long price = (long)booking.TotalPrice;
                            var intentRefund = payment.PaymentIntentId1 != "" ? payment.PaymentIntentId1 : payment.PaymentIntentId2;
                            if (intentRefund != "")
                            {
                                var refund = await CreateRefund(intentRefund, price);

                                if (refund == null) return null;
                            }
                        }
                    }

                    foreach (var RoomDto in booking.ListRooms)
                    {
                        var roomEntity = await _context.Rooms.FindAsync(RoomDto.RoomId);
                        if (roomEntity == null) return "room error.";
                        roomEntity.QuantityRoom += RoomDto.QuantityRoom - RoomDto.QuantityRoomExcess;
                        _context.Rooms.Update(roomEntity);
                        await _context.SaveChangesAsync();
                    }
                }
            }
            booking.Status = StatusBooking.PaymentCancel;
            await _context.SaveChangesAsync();
            return "Change Status Success";
        }
        public async Task<Refund> CreateRefund(string paymentIntentId, long originalAmount)
        {
            StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];
            var refundService = new RefundService();

            var newPrice = originalAmount * 65 / 100;

            var refundOptions = new RefundCreateOptions
            {
                PaymentIntent = paymentIntentId,
                Amount = newPrice * 100,
            };

            var refund = await refundService.CreateAsync(refundOptions);
            return refund;
        }

        public async Task<object> RemoveManyBooking(List<int> ids)
        {
            var bookingToRemove = await _context.Booking
                .Include(x => x.ListRooms)
                .Where(b => ids.Contains(b.Id))
                .ToListAsync();
            if (bookingToRemove == null) return null;

            var roomToRemove = new List<ListRoom>();

            foreach (var booking in bookingToRemove)
            {
                if (booking.Status == StatusBooking.PaymentDepositCompleted || booking.Status == StatusBooking.PaymentCompleted)
                {
                    return "Remove error";
                }
                else
                {
                    foreach (var room in booking.ListRooms)
                    {
                        var rooms = await _context.ListRooms
                            .Where(x => x.Id.Equals(room.Id))
                            .ToListAsync();
                        roomToRemove.AddRange(rooms);
                    }
                }
            }

            if (roomToRemove.Any())
            {
                _context.ListRooms.RemoveRange(roomToRemove);
                await _context.SaveChangesAsync();
            }

            _context.Booking.RemoveRange(bookingToRemove);
            await _context.SaveChangesAsync();

            return "Remove Many Booking !";
        }
        public async Task<object> RemoveBookingPayment(int id)
        {
            var bookingPayment = await GetByIdBookingPayment(id);
            if (bookingPayment == null) return null;

            _context.BookingPayments.Remove(bookingPayment);
            await _context.SaveChangesAsync();
            return bookingPayment;
        }
    }
}
