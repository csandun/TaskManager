namespace Csandun.TaskManagerApi.Exceptions;

public class TaskItemNotFound : KeyNotFoundException
{
    public TaskItemNotFound(int id)
        : base($"Task item with Id {id} not found.")
    {
    }
}