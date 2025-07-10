using Csandun.TaskManagerApi.Models;

namespace Csandun.TaskManagerApi.Infrastructure.Repositories;

public interface IUserRepository
{
    Task<User> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<User> GetByUsernameAsync(string username, string passwordHash, CancellationToken cancellationToken);
}