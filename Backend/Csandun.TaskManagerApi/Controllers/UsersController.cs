using Csandun.TaskManagerApi.Dtos;
using Csandun.TaskManagerApi.Dtos.User;
using Csandun.TaskManagerApi.Infrastructure.Repositories;
using Csandun.TaskManagerApi.Models;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Csandun.TaskManagerApi.Helpers;

namespace Csandun.TaskManagerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserRepository userRepository, IMapper mapper) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login([FromBody] UserLoginDto loginDto, CancellationToken cancellationToken)
    {
        var user = await userRepository.Authenticate(loginDto.Username, loginDto.Password.HashPassword(), cancellationToken);
        var userDto = mapper.Map<UserDto>(user);
        return Ok(userDto);
    }
}