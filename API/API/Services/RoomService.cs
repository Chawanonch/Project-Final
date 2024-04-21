using API.Data;
using API.Dtos;
using API.Models;
using API.Services.IService;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class RoomService : IRoomService
    {
        private readonly Context _context;
        private readonly IUploadFileService _uploadFileService;
        private readonly IMapper _mapper;
        private readonly IBuildingService _buildingService;

        public RoomService(Context context, IUploadFileService uploadFileService, IMapper mapper,IBuildingService buildingService)
        {
            _context = context;
            _uploadFileService = uploadFileService;
            _mapper = mapper;
            _buildingService = buildingService;
        }
        #region RoomType
        public async Task<List<RoomType>> GetRoomTypes()
        {
            return await _context.RoomTypes.ToListAsync();
        }
        public async Task<RoomType> GetByIdRoomType(int? id)
        {
            var roomType = await _context.RoomTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (roomType == null) return null;
            else return roomType;
        }
        public async Task<object> CAURoomType(RoomTypeRequest request)
        {
            var result = _mapper.Map<RoomType>(request);
            var roomType = await GetByIdRoomType(request?.Id);
            if (roomType == null) await _context.RoomTypes.AddAsync(result);
            else _context.RoomTypes.Update(result);
            await _context.SaveChangesAsync();
            return result;
        }
        public async Task<object> RemoveRoomType(int id)
        {
            var roomType = await GetByIdRoomType(id);
            if (roomType == null) return null;

            _context.RoomTypes.Remove(roomType);
            await _context.SaveChangesAsync();
            return "success";
        }
        #endregion

        #region Room
        public async Task<List<Room>> GetRooms()
        {
            return await _context.Rooms
                .Include(x=>x.Building)
                .Include(x=>x.RoomType)
                .Include(x=>x.RoomImages)
                .ToListAsync();
        }
        public async Task<Room> GetByIdRoom(int? id)
        {
            var room = await _context.Rooms.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (room == null) return null;
            else return room;
        }
        public async Task<object> CAURoom(RoomRequest request)
        {
            (string errorMessage, string imageName) = await _uploadFileService.UploadImageAsync(request?.Image);
            if (!string.IsNullOrEmpty(errorMessage)) return errorMessage;

            (string errorMessge, List<string> imageNames) = await _uploadFileService.UploadImagesAsync(request?.Images);
            if (!string.IsNullOrEmpty(errorMessge)) return errorMessge;

            var result = _mapper.Map<Room>(request);
            result.Image = imageName;

            var roomType = await GetByIdRoomType(request.RoomTypeId);
            if (roomType == null) return "RoomType not found!";

            var numBuilding = await _buildingService.GetByIdBuilding(request.BuildingId);
            if (numBuilding == null) return "Building not found!";

            var room = await GetByIdRoom(request?.Id);

            if (room == null) 
            {
                await _context.Rooms.AddAsync(result); 
            }
            else
            {
                if (request.Image == null) result.Image = room.Image;
                _context.Rooms.Update(result);
                //ลบในไฟล์
                if (request.Image != null && room.Image != imageName) await _uploadFileService.DeleteFileImage(room.Image);
            }
            await _context.SaveChangesAsync();

            if (imageNames.Count() > 0)
            {
                var roomImages = await _context.RoomImages.Where(x => x.RoomId.Equals(result.Id)).ToListAsync();
                if (roomImages is not null)
                {
                    _context.RoomImages.RemoveRange(roomImages);
                    await _context.SaveChangesAsync();

                    var file = roomImages.Select(x => x.Image).ToList();
                    await _uploadFileService.DeleteFileImages(file);
                }

                var images = new List<RoomImages>();
                imageNames.ForEach(imageName =>
                {
                    images.Add(new RoomImages
                    {
                        Image = imageName,
                        RoomId = result.Id
                    });
                });

                await _context.RoomImages.AddRangeAsync(images);
                await _context.SaveChangesAsync();
            }

            return result;
        }
        public async Task<object> RemoveRoom(int id)
        {
            var room = await GetByIdRoom(id);
            if (room == null) return null;

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            await _uploadFileService.DeleteFileImage(room.Image);
            return room;
        }
        #endregion
    }
}
