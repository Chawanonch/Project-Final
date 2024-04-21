using API.Dtos;
using API.Models;

namespace API.Services.IService
{
    public interface ISoftpowerService
    {
        Task<List<SoftpowerType>> GetSoftpowerTypes();
        Task<SoftpowerType> GetByIdSoftpowerType(int? id);
        Task<object> CAUSoftpowerType(SoftpowerTypeRequest request);
        Task<object> RemoveSoftpowerType(int id);

        Task<List<Softpower>> GetSoftpowers();
        Task<Softpower> GetByIdSoftpower(int? id);
        Task<object> CAUSoftpower(SoftpowerRequest request);
        Task<object> RemoveSoftpower(int id);
    }
}
