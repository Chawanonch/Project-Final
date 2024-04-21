using API.Data;
using API.Dtos;
using API.Models;
using API.Services.IService;
using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace API.Services
{
    public class BuildingService : IBuildingService
    {
        private readonly Context _context;
        private readonly IUploadFileService _uploadFileService;
        private readonly IMapper _mapper;

        public BuildingService(Context context,IUploadFileService uploadFileService, IMapper mapper)
        {
            _context = context;
            _uploadFileService = uploadFileService;
            _mapper = mapper;
        }
        public async Task<List<Building>> GetBuildings()
        {
            return await _context.Building.ToListAsync();
        }

        public async Task<Building> GetByIdBuilding(int? id)
        {
            var building = await _context.Building.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (building == null) return null;
            else return building;
        }

        public async Task<object> CAUBuilding(BuildingRequest request)
        {
            //เช็คอัพโหลด 1 รูป
            (string errorMessage, string imageName) = await _uploadFileService.UploadImageAsync(request.Image);
            if (!string.IsNullOrEmpty(errorMessage)) return errorMessage;

            var result = _mapper.Map<Building>(request);
            var building = await GetByIdBuilding(request?.Id);
            result.Image = imageName;
            if (building == null)
            {
                await _context.Building.AddAsync(result);
            }
            else
            {
                if (request?.Image == null) result.Image = building.Image;
                _context.Building.Update(result);
                if (request.Image != null && building.Image != imageName) await _uploadFileService.DeleteFileImage(building.Image);
            }
            await _context.SaveChangesAsync();

            return "success";
        }

        public async Task<object> RemoveBuilding(int id)
        {
            var building = await GetByIdBuilding(id);
            if (building == null) return null;

            _context.Building.Remove(building);
            await _context.SaveChangesAsync();
            await _uploadFileService.DeleteFileImage(building.Image);
            return "success";
        }
    }
}
