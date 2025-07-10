using Csandun.TaskManagerApi.Dtos;
using Csandun.TaskManagerApi.Helpers;
using Csandun.TaskManagerApi.Infrastructure.Repositories;
using Csandun.TaskManagerApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace Csandun.TaskManagerApi.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserRepository userRepository) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login([FromBody] UserLoginRequest loginRequest, CancellationToken cancellationToken)
    {
        var hashedPassword = loginRequest.Password.HashPassword();
        
        var user = await userRepository.GetByUsernameAsync(loginRequest.Username, hashedPassword, cancellationToken);
        return Ok(user);
    }
}