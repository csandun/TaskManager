using Csandun.TaskManagerApi.Models;

namespace Csandun.TaskManagerApi.Infrastructure.Repositories;

public interface ITaskItemRepository
{
    Task<TaskItem> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<TaskItem> AddAsync(TaskItem taskItem, CancellationToken cancellationToken);
    Task<TaskItem> UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken);
    Task DeleteAsync(int id, CancellationToken cancellationToken);
    Task<IEnumerable<TaskItem>> GetByUserIdAndStatusAsync(int userId, CancellationToken cancellationToken);
    Task<IEnumerable<TaskItem>> GetByUserIdAndPriorityAsync(int userId, PriorityEnum priority, CancellationToken cancellationToken);
    Task<TaskItem> UpdateStatusAsync(int id, bool isCompleted, CancellationToken cancellationToken);
}