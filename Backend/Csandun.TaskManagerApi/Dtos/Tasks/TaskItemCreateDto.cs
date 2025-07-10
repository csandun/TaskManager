using Csandun.TaskManagerApi.Models;

namespace Csandun.TaskManagerApi.Dtos.Tasks;

public class TaskItemCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PriorityEnum Priority { get; set; } = PriorityEnum.Medium;
    public DateTime? DueDate { get; set; }
    public int UserId { get; set; }
}