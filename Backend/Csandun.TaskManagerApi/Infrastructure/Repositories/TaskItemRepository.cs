using Csandun.TaskManagerApi.Exceptions;
using Csandun.TaskManagerApi.Infrastructure.DbContext;
using Csandun.TaskManagerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace Csandun.TaskManagerApi.Infrastructure.Repositories;

public class TaskItemRepository(TaskManagerDbContext dbContext) : ITaskItemRepository
{
    public async Task<TaskItem> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var taskItem = await dbContext.TaskItems.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (taskItem is null) throw new TaskItemNotFound(id);
        return taskItem;
    }

    public async Task<TaskItem> AddAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        await dbContext.TaskItems.AddAsync(taskItem, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return taskItem;
    }

    public async Task<TaskItem> UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        var existingTaskItem = await dbContext.TaskItems.FirstOrDefaultAsync(t => t.Id == taskItem.Id, cancellationToken);
        if (existingTaskItem is null)
        {
            throw new TaskItemNotFound(taskItem.Id);
            ;
        }

        existingTaskItem.Title = taskItem.Title;
        existingTaskItem.Description = taskItem.Description;
        existingTaskItem.IsCompleted = taskItem.IsCompleted;
        existingTaskItem.Priority = taskItem.Priority;

        await dbContext.SaveChangesAsync(cancellationToken);
        return existingTaskItem;
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var taskItem = await dbContext.TaskItems.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (taskItem is null) throw new TaskItemNotFound(id);
        dbContext.TaskItems.Remove(taskItem);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<TaskItem>> GetByUserIdAndStatusAsync(int userId, bool isCompleted = false, CancellationToken cancellationToken = default)
    {
        var taskItems = await dbContext.TaskItems
            .Where(t => t.UserId == userId && t.IsCompleted == isCompleted)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);
        return taskItems;
    }

    public async Task<IEnumerable<TaskItem>> GetByUserIdAndPriorityAsync(int userId, PriorityEnum priority, CancellationToken cancellationToken = default)
    {
        var taskItems = await dbContext.TaskItems
            .Where(t => t.UserId == userId && t.Priority == priority)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);
        return taskItems;
    }

    public async Task<TaskItem> UpdateStatusAsync(int id, bool isCompleted = true, CancellationToken cancellationToken = default)
    {
        var taskItem = await dbContext.TaskItems.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (taskItem is null) throw new TaskItemNotFound(id);

        taskItem.IsCompleted = isCompleted;
        await dbContext.SaveChangesAsync(cancellationToken);
        return taskItem;
    }
}