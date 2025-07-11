using System.Security.Claims;
using Csandun.TaskManagerApi.Exceptions;

namespace Csandun.TaskManagerApi.Services;

public class UserContextAccessor(IHttpContextAccessor httpContextAccessor)
{
    public string GetCurrentUserId()
    {
        var userId = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedAccessException("cannot access user context");
        }      
        
        return userId;
    }
    
}