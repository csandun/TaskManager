using Csandun.TaskManagerApi.Exceptions;
using Csandun.TaskManagerApi.Infrastructure.DbContext;
using Csandun.TaskManagerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace Csandun.TaskManagerApi.Infrastructure.Repositories;

public class UserRepository(TaskManagerDbContext dbContext) : IUserRepository
{
    public async Task<User> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user is null)
        {
            throw new UserNotFound(id);
        }

        return user;
    }

    public async Task<User> GetByUsernameAsync(string username, string passwordHash, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == passwordHash, cancellationToken);
        if (user is null)
        {
            throw new UserNotFound(username);
        }

        return user;
    }
}