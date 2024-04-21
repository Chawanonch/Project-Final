using API.Models;

namespace API.Dtos
{
    public class BookingRequest
    {
        public int? Id { get; set; }
        public List<ListRoomDto> ListRooms { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public StatusBooking? Status { get; set; } = StatusBooking.Pending;
        public double? TotalPrice { get; set; }
        public int? UserId { get; set; }
        //public int QuantityRoom { get; set; }
        //public int? QuantityRoomExcess { get; set; } = 0;
        //public int RoomId { get; set; }
        public DateTime? DateCreated { get; set; } = DateTime.Now;
        public StatusCheckIn StatusCheckIn { get; set; } = StatusCheckIn.NotCome;
        public DateTime? CheckInTime { get; set; } = null;
    }

    public class ListRoomDto
    {
        public int? Id { get; set; }
        public int RoomId { get; set; }
        public int? BookingId { get; set; }
        public int QuantityRoom { get; set; }
        public int? QuantityRoomExcess { get; set; } = 0;
    }
}
