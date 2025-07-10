using AutoMapper;
using Csandun.TaskManagerApi.Dtos.Tasks;
using Csandun.TaskManagerApi.Dtos.User;
using Csandun.TaskManagerApi.Models;

namespace Csandun.TaskManagerApi.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        ConfigureTaskMappings();
        ConfigureUserMappings();
    }

    private void ConfigureTaskMappings()
    {
        CreateMap<TaskItem, TaskItemDto>()
            .ReverseMap();

        CreateMap<TaskItemCreateDto, TaskItem>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsCompleted, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.User, opt => opt.Ignore());

        CreateMap<TaskItemUpdateDto, TaskItem>()
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore());

        CreateMap<TaskItem, TaskItemUpdateDto>();
    }

    private void ConfigureUserMappings()
    {
        CreateMap<User, UserDto>();
    }
}