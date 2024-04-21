using API.Dtos;
using API.Models;
using AutoMapper;

namespace API
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Building, BuildingRequest>();
            CreateMap<BuildingRequest, Building>();

            CreateMap<RoomType, RoomTypeRequest>();
            CreateMap<RoomTypeRequest, RoomType>();

            CreateMap<Room, RoomRequest>();
            CreateMap<RoomRequest, Room>();

            CreateMap<Booking, BookingRequest>();
            CreateMap<BookingRequest, Booking>();

            CreateMap<BookingPayment, BookingPaymentRequest>();
            CreateMap<BookingPaymentRequest, BookingPayment>();

            CreateMap<SoftpowerType, SoftpowerTypeRequest>();
            CreateMap<SoftpowerTypeRequest, SoftpowerType>();

            CreateMap<Softpower, SoftpowerRequest>();
            CreateMap<SoftpowerRequest, Softpower>();

            CreateMap<Comment, CommentRequest>();
            CreateMap<CommentRequest, Comment>();

            CreateMap<CommentPackage, CommentPackageRequest>();
            CreateMap<CommentPackageRequest, CommentPackage>();

            CreateMap<Package, PackageRequest>();
            CreateMap<PackageRequest, Package>();

            CreateMap<RoomPackage, RoomPackageDto>();
            CreateMap<RoomPackageDto, RoomPackage>();

            CreateMap<SoftpowerPackage, SoftpowerPackageDto>();
            CreateMap<SoftpowerPackageDto, SoftpowerPackage>();

            CreateMap<BookingPackage, BookingPackageRequest>();
            CreateMap<BookingPackageRequest, BookingPackage>();

            CreateMap<ListPackage, ListPackageDto>();
            CreateMap<ListPackageDto, ListPackage>();

            CreateMap<BookingPackagePayment, BookingPackagePaymentRequest>();
            CreateMap<BookingPackagePaymentRequest, BookingPackagePayment>();

            CreateMap<ListRoom, ListRoomDto>();
            CreateMap<ListRoomDto, ListRoom>();
        }
    }
}
