using Csandun.TaskManagerApi.Infrastructure.Configurations;
using Csandun.TaskManagerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace Csandun.TaskManagerApi.Infrastructure.DbContext;

public class TaskManagerDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public TaskManagerDbContext(DbContextOptions<TaskManagerDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> TaskItems { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new TaskItemConfiguration());
    }
}