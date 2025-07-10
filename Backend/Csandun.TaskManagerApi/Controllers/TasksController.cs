using Csandun.TaskManagerApi.Dtos.Tasks;
using Microsoft.AspNetCore.Mvc;
using Csandun.TaskManagerApi.Infrastructure.Repositories;
using Csandun.TaskManagerApi.Models;
using AutoMapper;

namespace Csandun.TaskManagerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(ITaskItemRepository taskRepository, IMapper mapper) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItemDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(id, cancellationToken);
        var taskDto = mapper.Map<TaskItemDto>(task);
        return Ok(taskDto);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItemDto>> Create([FromBody] TaskItemCreateDto taskItemCreateDto, CancellationToken cancellationToken)
    {
        var taskItem = mapper.Map<TaskItem>(taskItemCreateDto);
        var createdTask = await taskRepository.AddAsync(taskItem, cancellationToken);
        var createdTaskDto = mapper.Map<TaskItemDto>(createdTask);
        return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTaskDto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskItemDto>> Update(int id, [FromBody] TaskItemUpdateDto taskItemUpdateDto, CancellationToken cancellationToken = default)
    {
        var taskItem = mapper.Map<TaskItem>(taskItemUpdateDto);
        var updatedTask = await taskRepository.UpdateAsync(taskItem, cancellationToken);
        var updatedTaskDto = mapper.Map<TaskItemDto>(updatedTask);
        return Ok(updatedTaskDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        await taskRepository.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetByUserIdAndStatus(int userId, [FromQuery] bool isCompleted = false, CancellationToken cancellationToken = default)
    {
        var tasks = await taskRepository.GetByUserIdAndStatusAsync(userId, isCompleted, cancellationToken);
        var taskDtos = mapper.Map<IEnumerable<TaskItemDto>>(tasks);
        return Ok(taskDtos);
    }

    [HttpPatch("{id}/complete")]
    public async Task<ActionResult<TaskItemDto>> UpdateCompleted(int id, [FromQuery] bool isCompleted = true, CancellationToken cancellationToken = default)
    {
        var updatedTask = await taskRepository.UpdateStatusAsync(id, isCompleted, cancellationToken);
        var updatedTaskDto = mapper.Map<TaskItemDto>(updatedTask);
        return Ok(updatedTaskDto);
    }
}