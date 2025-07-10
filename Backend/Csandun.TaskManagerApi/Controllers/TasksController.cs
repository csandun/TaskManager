using Microsoft.AspNetCore.Mvc;
using Csandun.TaskManagerApi.Infrastructure.Repositories;
using Csandun.TaskManagerApi.Models;

namespace Csandun.TaskManagerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(ITaskItemRepository taskRepository) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetById(int id, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(id, cancellationToken);
        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> Create([FromBody] TaskItem taskItem, CancellationToken cancellationToken)
    {
        var createdTask = await taskRepository.AddAsync(taskItem, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskItem>> Update(int id, [FromBody] TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        var updatedTask = await taskRepository.UpdateAsync(taskItem, cancellationToken);
        return Ok(updatedTask);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        await taskRepository.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetByUserIdAndStatus(int userId, [FromQuery] bool isCompleted = false, CancellationToken cancellationToken = default)
    {
        var tasks = await taskRepository.GetByUserIdAndStatusAsync(userId, isCompleted, cancellationToken);
        return Ok(tasks);
    }

    [HttpPatch("{id}/complete")]
    public async Task<ActionResult<TaskItem>> UpdateCompleted(int id, [FromBody] bool isCompleted, CancellationToken cancellationToken = default)
    {
        var updatedTask = await taskRepository.UpdateCompletedAsync(id, isCompleted, cancellationToken);
        return Ok(updatedTask);
    }
}
