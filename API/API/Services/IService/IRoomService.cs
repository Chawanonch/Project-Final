using API.Dtos;
using API.Models;

namespace API.Services.IService
{
    public interface IRoomService
    {
        Task<List<RoomType>> GetRoomTypes();
        Task<RoomType> GetByIdRoomType(int? id);
        Task<object> CAURoomType(RoomTypeRequest request);
        Task<object> RemoveRoomType(int id);

        Task<List<Room>> GetRooms();
        Task<Room> GetByIdRoom(int? id);
        Task<object> CAURoom(RoomRequest request);
        Task<object> RemoveRoom(int id);
    }
}
