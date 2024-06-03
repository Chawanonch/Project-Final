using API.Data;
using API.Dtos;
using API.Models;
using API.Services.IService;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace API.Services
{
    public class CommentService : ICommentService
    {
        private readonly Context _context;
        private readonly IUploadFileService _uploadFileService;
        private readonly IMapper _mapper;

        public CommentService(Context context, IUploadFileService uploadFileService, IMapper mapper)
        {
            _context = context;
            _uploadFileService = uploadFileService;
            _mapper = mapper;
        }
        public async Task<List<Comment>> GetComments()
        {
            return await _context.Comments
                .Include(x => x.CommentImages)
                .OrderBy(x => x.Star)
                .ToListAsync();
        }
        public async Task<Comment> GetByIdComment(int? id)
        {
            var comment = await _context.Comments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (comment == null) return null;
            else return comment;
        }
        public async Task<object> CAUComment(CommentRequest request)
        {
            (string errorMessge, List<string> imageNames) = await _uploadFileService.UploadImagesAsync(request?.Images);
            if (!string.IsNullOrEmpty(errorMessge)) return errorMessge;

            var result = _mapper.Map<Comment>(request);

            var booking = await _context.Booking.FindAsync(request.BookingId);
            if (booking == null) return "booking not found!";
            if(booking.Status != StatusBooking.PaymentCompleted) return "not paid!";

            var comment = await GetByIdComment(request?.Id);
            if (comment == null) await _context.Comments.AddAsync(result);
            else _context.Comments.Update(result);
            await _context.SaveChangesAsync();

            if (imageNames.Count() > 0)
            {
                var commentImages = await _context.CommentImages.Where(x => x.CommentId.Equals(result.Id)).ToListAsync();
                if (commentImages is not null)
                {
                    _context.CommentImages.RemoveRange(commentImages);
                    await _context.SaveChangesAsync();

                    var file = commentImages.Select(x => x.Image).ToList();
                    await _uploadFileService.DeleteFileImages(file);
                }

                var images = new List<CommentImages>();
                imageNames.ForEach(imageName =>
                {
                    images.Add(new CommentImages
                    {
                        Image = imageName,
                        CommentId = result.Id
                    });
                });

                await _context.CommentImages.AddRangeAsync(images);
                await _context.SaveChangesAsync();
            }

            return result;
        }
        public async Task<object> RemoveComment(int id)
        {
            var comment = await GetByIdComment(id);
            if (comment == null) return null;

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            var commentImages = await _context.CommentImages.Where(x => x.CommentId.Equals(id)).ToListAsync();
            if (commentImages is not null)
            {
                _context.CommentImages.RemoveRange(commentImages);
                await _context.SaveChangesAsync();

                var file = commentImages.Select(x => x.Image).ToList();
                await _uploadFileService.DeleteFileImages(file);
                await _context.SaveChangesAsync();
            }
            return comment;
        }

        public async Task<List<CommentPackage>> GetCommentPackages()
        {
            return await _context.CommentPackages
                .Include(x => x.CommentPackageImages)
                .ToListAsync();
        }
        public async Task<CommentPackage> GetByIdCommentPackage(int? id)
        {
            var comment = await _context.CommentPackages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (comment == null) return null;
            else return comment;
        }
        public async Task<object> CAUCommentPackage(CommentPackageRequest request)
        {
            (string errorMessge, List<string> imageNames) = await _uploadFileService.UploadImagesAsync(request?.Images);
            if (!string.IsNullOrEmpty(errorMessge)) return errorMessge;

            var result = _mapper.Map<CommentPackage>(request);
            
            var booking = await _context.BookingPackages.FindAsync(request.BookingPackageId);
            if (booking == null) return "booking not found!";
            if (booking.Status != StatusBooking.PaymentCompleted) return "not paid!";

            var comment = await GetByIdCommentPackage(request?.Id);
            if (comment == null) await _context.CommentPackages.AddAsync(result);
            else _context.CommentPackages.Update(result);
            await _context.SaveChangesAsync();

            if (imageNames.Count() > 0)
            {
                var commentImages = await _context.CommentPackageImages.Where(x => x.CommentPackageId.Equals(result.Id)).ToListAsync();
                if (commentImages is not null)
                {
                    _context.CommentPackageImages.RemoveRange(commentImages);
                    await _context.SaveChangesAsync();

                    var file = commentImages.Select(x => x.Image).ToList();
                    await _uploadFileService.DeleteFileImages(file);
                }

                var images = new List<CommentPackageImages>();
                imageNames.ForEach(imageName =>
                {
                    images.Add(new CommentPackageImages
                    {
                        Image = imageName,
                        CommentPackageId = result.Id
                    });
                });

                await _context.CommentPackageImages.AddRangeAsync(images);
                await _context.SaveChangesAsync();
            }

            return result;
        }
        public async Task<object> RemoveCommentPackage(int id)
        {
            var comment = await GetByIdCommentPackage(id);
            if (comment == null) return null;

            _context.CommentPackages.Remove(comment);
            await _context.SaveChangesAsync();

            var commentImages = await _context.CommentPackageImages.Where(x => x.CommentPackageId.Equals(id)).ToListAsync();
            if (commentImages is not null)
            {
                _context.CommentPackageImages.RemoveRange(commentImages);
                await _context.SaveChangesAsync();

                var file = commentImages.Select(x => x.Image).ToList();
                await _uploadFileService.DeleteFileImages(file);
                await _context.SaveChangesAsync();
            }
            return comment;
        }
    }
}
