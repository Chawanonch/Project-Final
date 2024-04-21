using API.Dtos;
using API.Models;

namespace API.Services.IService
{
    public interface IPackageService
    {
        Task<List<Package>> GetPackages();
        Task<Package> GetByIdPackage(int? id);
        Task<object> CAUPackage(PackageRequest request);
        Task<object> RemovePackage(int id);
    }
}
