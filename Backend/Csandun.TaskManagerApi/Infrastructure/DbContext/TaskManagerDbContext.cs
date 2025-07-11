using Csandun.TaskManagerApi.Helpers;
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
        
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        var hashedPassword = "123".HashPassword();
        
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "csandun",
                PasswordHash = hashedPassword,
                CreatedAt = new DateTime(2025, 7, 11, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            }
        );
    }
}