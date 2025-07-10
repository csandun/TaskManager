using Csandun.TaskManagerApi.Models;

namespace Csandun.TaskManagerApi.Dtos.Tasks;

public class TaskItemDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public PriorityEnum Priority { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    public int UserId { get; set; }
}