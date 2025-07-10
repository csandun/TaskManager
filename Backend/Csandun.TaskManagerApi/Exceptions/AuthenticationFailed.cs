namespace Csandun.TaskManagerApi.Exceptions;

public class AuthenticationFailed : UnauthorizedAccessException
{
    public AuthenticationFailed(string username)
        : base($"Authentication failed for user '{username}'.")
    {
    }
}