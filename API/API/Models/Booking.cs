using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public StatusBooking Status { get; set; }
        public double TotalPrice { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        public List<ListRoom> ListRooms { get; set; }

        //public int QuantityRoom { get; set; }
        //public int QuantityRoomExcess { get; set; }
        //public int RoomId { get; set; }
        //[JsonIgnore]
        //public Room Room { get; set; }
        public DateTime DateCreated { get; set; }
        public StatusCheckIn StatusCheckIn { get; set; }
        public DateTime CheckInTime { get; set; }
    }
    public class ListRoom
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        [JsonIgnore]
        public Room Room { get; set; }
        public int BookingId { get; set; }
        [JsonIgnore]
        public Booking Booking { get; set; }
        public int QuantityRoom { get; set; }
        public int QuantityRoomExcess { get; set; }
    }
}
