namespace Csandun.TaskManagerApi.Exceptions;

public class UserNotFound : KeyNotFoundException
{
    public UserNotFound(int id)
        : base($"User with Id {id} not found.")
    {
    }

    public UserNotFound(string username)
        : base($"User with username '{username}' not found.")
    {
    }
}