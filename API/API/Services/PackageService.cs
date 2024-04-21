using API.Data;
using API.Dtos;
using API.Models;
using API.Services.IService;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class PackageService : IPackageService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IRoomService _roomService;
        private readonly ISoftpowerService _softpowerService;

        public PackageService(Context context, IMapper mapper, IRoomService roomService, ISoftpowerService softpowerService)
        {
            _context = context;
            _mapper = mapper;
            _roomService = roomService;
            _softpowerService = softpowerService;
        }
        public async Task<List<Package>> GetPackages()
        {
            return await _context.Packages
                .Include(x =>x.RoomPackages)
                .Include(x =>x.SoftpowerPackages)
                .ToListAsync();
        }
        public async Task<Package> GetByIdPackage(int? id)
        {
            var package = await _context.Packages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (package == null) return null;
            else return package;
        }
        public async Task<object> CAUPackage(PackageRequest request)
        {
            var result = _mapper.Map<Package>(request);
            var package = await GetByIdPackage(request?.Id);

            if (request?.RoomPackages.Count() > 0)
            {
                foreach (var roomDto in request.RoomPackages)
                {
                    var roomEntity = await _roomService.GetByIdRoom(roomDto.RoomId);
                    if (roomEntity == null)
                    {
                        result.RoomPackages.Clear();
                    }
                }
            }

            if (request?.SoftpowerPackages.Count() > 0)
            {
                foreach (var softpowerDto in request.SoftpowerPackages)
                {
                    var softpowerEntity = await _softpowerService.GetByIdSoftpower(softpowerDto.SoftpowerId);
                    if (softpowerEntity == null)
                    {
                        result.SoftpowerPackages.Clear();
                    }
                }
            }

            if (package == null) await _context.Packages.AddAsync(result);
            else {
                if (request?.RoomPackages.Count() == 0)
                {
                    var roomPackage = await _context.RoomPackages.Where(x => x.PackageId.Equals(result.Id)).ToListAsync();
                    if (roomPackage is not null)
                    {
                        _context.RoomPackages.RemoveRange(roomPackage);
                        await _context.SaveChangesAsync();
                    }
                }
                if (request?.SoftpowerPackages.Count() == 0)
                {
                    var softpowerPackage = await _context.SoftpowerPackages.Where(x => x.PackageId.Equals(result.Id)).ToListAsync();
                    if (softpowerPackage is not null)
                    {
                        _context.SoftpowerPackages.RemoveRange(softpowerPackage);
                        await _context.SaveChangesAsync();
                    }
                }
                _context.Packages.Update(result); 
            }
            await _context.SaveChangesAsync();

            if (request?.RoomPackages.Count() > 0)
            {
                var roomPackage = await _context.RoomPackages.Where(x => x.PackageId.Equals(result.Id)).ToListAsync();
                if (roomPackage is not null)
                {
                    _context.RoomPackages.RemoveRange(roomPackage);
                    await _context.SaveChangesAsync();
                }

                var room = new List<RoomPackage>();
                foreach (var roomDto in request.RoomPackages)
                {
                    var roomEntity = await _roomService.GetByIdRoom(roomDto.RoomId);
                    if (roomEntity == null) return "Error: Room not found";

                    var newRoomPackage = new RoomPackage
                    {
                        RoomId = roomEntity.Id,
                        PackageId = result.Id
                    };

                    room.Add(newRoomPackage);
                }
                result.RoomPackages = room;

                _context.Packages.Update(result);
                await _context.RoomPackages.AddRangeAsync(room);
                await _context.SaveChangesAsync();
            }

            if (request?.SoftpowerPackages.Count() > 0)
            {
                var softpowerPackage = await _context.SoftpowerPackages.Where(x => x.PackageId.Equals(result.Id)).ToListAsync();
                if (softpowerPackage is not null)
                {
                    _context.SoftpowerPackages.RemoveRange(softpowerPackage);
                    await _context.SaveChangesAsync();
                }

                var softpower = new List<SoftpowerPackage>();
                foreach (var softpowerDto in request.SoftpowerPackages)
                {
                    var softpowerEntity = await _softpowerService.GetByIdSoftpower(softpowerDto.SoftpowerId);
                    if (softpowerEntity == null) return "Error: Softpower not found";

                    var newSoftpowerPackage = new SoftpowerPackage
                    {
                        SoftpowerId = softpowerEntity.Id,
                        PackageId = result.Id,
                    };

                    softpower.Add(newSoftpowerPackage);
                }
                result.SoftpowerPackages = softpower;

                _context.Packages.Update(result);
                await _context.SoftpowerPackages.AddRangeAsync(softpower);
                await _context.SaveChangesAsync();
            }
            return result;
        }

        public async Task<object> RemovePackage(int id)
        {
            var package = await GetByIdPackage(id);
            if (package == null) return null;

            _context.Packages.Remove(package);
            await _context.SaveChangesAsync();
            return package;
        }
    }
}
