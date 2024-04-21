using API.Dtos;
using API.Models;

namespace API.Services.IService
{
    public interface ICommentService
    {
        Task<List<Comment>> GetComments();
        Task<Comment> GetByIdComment(int? id);
        Task<object> CAUComment(CommentRequest request);
        Task<object> RemoveComment(int id);

        Task<List<CommentPackage>> GetCommentPackages();
        Task<CommentPackage> GetByIdCommentPackage(int? id);
        Task<object> CAUCommentPackage(CommentPackageRequest request);
        Task<object> RemoveCommentPackage(int id);
    }
}
