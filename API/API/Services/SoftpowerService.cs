using API.Data;
using API.Dtos;
using API.Models;
using API.Services.IService;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class SoftpowerService : ISoftpowerService
    {
        private readonly Context _context;
        private readonly IUploadFileService _uploadFileService;
        private readonly IMapper _mapper;

        public SoftpowerService(Context context, IUploadFileService uploadFileService, IMapper mapper)
        {
            _context = context;
            _uploadFileService = uploadFileService;
            _mapper = mapper;
        }

        #region SoftpowerType
        public async Task<List<SoftpowerType>> GetSoftpowerTypes()
        {
            return await _context.SoftpowerTypes.ToListAsync();
        }
        public async Task<SoftpowerType> GetByIdSoftpowerType(int? id)
        {
            var softpowerType = await _context.SoftpowerTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (softpowerType == null) return null;
            else return softpowerType;
        }
        public async Task<object> CAUSoftpowerType(SoftpowerTypeRequest request)
        {
            var result = _mapper.Map<SoftpowerType>(request);
            var softpowerType = await GetByIdSoftpowerType(request?.Id);
            if (softpowerType == null) await _context.SoftpowerTypes.AddAsync(result);
            else _context.SoftpowerTypes.Update(result);
            await _context.SaveChangesAsync();
            return "success";
        }
        public async Task<object> RemoveSoftpowerType(int id)
        {
            var softpowerType = await GetByIdSoftpowerType(id);
            if (softpowerType == null) return null;

            _context.SoftpowerTypes.Remove(softpowerType);
            await _context.SaveChangesAsync();
            return "success";
        }
        #endregion

        #region Softpower
        public async Task<List<Softpower>> GetSoftpowers()
        {
            return await _context.Softpowers
                .Include(x => x.SoftpowerType)
                .Include(x => x.SoftpowerImages)
                .ToListAsync();
        }
        public async Task<Softpower> GetByIdSoftpower(int? id)
        {
            var softpower = await _context.Softpowers.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (softpower == null) return null;
            else return softpower;
        }
        public async Task<object> CAUSoftpower(SoftpowerRequest request)
        {
            (string errorMessage, string imageName) = await _uploadFileService.UploadImageAsync(request?.Image);
            if (!string.IsNullOrEmpty(errorMessage)) return errorMessage;

            (string errorMessge, List<string> imageNames) = await _uploadFileService.UploadImagesAsync(request?.Images);
            if (!string.IsNullOrEmpty(errorMessge)) return errorMessge;

            var result = _mapper.Map<Softpower>(request);
            result.Image = imageName;

            var softpowerType = await GetByIdSoftpowerType(request.SoftpowerTypeId);
            if (softpowerType == null) return "softpowerType not found!";

            var softpower = await GetByIdSoftpower(request?.Id);

            if (softpower == null)
            {
                await _context.Softpowers.AddAsync(result);
            }
            else
            {
                if (request?.Image == null) result.Image = softpower.Image;
                _context.Softpowers.Update(result);
                //ลบในไฟล์
                if (request.Image != null && softpower.Image != imageName) await _uploadFileService.DeleteFileImage(softpower.Image);
            }
            await _context.SaveChangesAsync();

            if (imageNames.Count() > 0)
            {
                var softpowerImages = await _context.SoftpowerImages.Where(x => x.SoftpowerId.Equals(result.Id)).ToListAsync();
                if (softpowerImages is not null)
                {
                    _context.SoftpowerImages.RemoveRange(softpowerImages);
                    await _context.SaveChangesAsync();

                    var file = softpowerImages.Select(x => x.Image).ToList();
                    await _uploadFileService.DeleteFileImages(file);
                }

                var images = new List<SoftpowerImages>();
                imageNames.ForEach(imageName =>
                {
                    images.Add(new SoftpowerImages
                    {
                        Image = imageName,
                        SoftpowerId = result.Id
                    });
                });

                await _context.SoftpowerImages.AddRangeAsync(images);
                await _context.SaveChangesAsync();
            }

            return result;
        }
        public async Task<object> RemoveSoftpower(int id)
        {
            var softpower = await GetByIdSoftpower(id);
            if (softpower == null) return null;

            _context.Softpowers.Remove(softpower);
            await _context.SaveChangesAsync();
            await _uploadFileService.DeleteFileImage(softpower.Image);
            return softpower;
        }

        #endregion
    }
}
