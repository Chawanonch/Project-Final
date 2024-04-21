using API.Dtos;
using API.Models;

namespace API.Services.IService
{
    public interface IBuildingService
    {
        Task<List<Building>> GetBuildings();
        Task<Building> GetByIdBuilding(int? id);

        Task<object> CAUBuilding(BuildingRequest request);
        Task<object> RemoveBuilding(int id);
    }
}
