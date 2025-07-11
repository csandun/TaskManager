import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskItem, TaskPriority } from '../../../shared/models/task-item.model';

@Component({
  standalone: true,
  selector: 'app-task-item',
  imports: [
    CommonModule
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input() task!: TaskItem;
  @Output() taskToggle = new EventEmitter<number>();
  @Output() taskDelete = new EventEmitter<number>();
  @Output() taskEdit = new EventEmitter<number>();
  
  get checkboxId(): string {
    return `task-checkbox-${this.task.id}`;
  }

  TaskPriority = TaskPriority;

  onToggleComplete() {
    this.taskToggle.emit(this.task.id);
  }

  onDelete() {
    this.taskDelete.emit(this.task.id);
  }

  onEdit() {
    this.taskEdit.emit(this.task.id);
  }

  getPriorityColor(): string {
    switch (this.task.priority) {
      case TaskPriority.URGENT:
        return 'red';
      case TaskPriority.HIGH:
        return 'orange';
      case TaskPriority.MEDIUM:
        return 'blue';
      case TaskPriority.LOW:
        return 'green';
      default:
        return 'gray';
    }
  }

  getPriorityText(): string {
    switch (this.task.priority) {
      case TaskPriority.URGENT:
        return 'Urgent';
      case TaskPriority.HIGH:
        return 'High';
      case TaskPriority.MEDIUM:
        return 'Medium';
      case TaskPriority.LOW:
        return 'Low';
      default:
        return 'None';
    }
  }

  isOverdue(): boolean {
    if (!this.task.dueDate) return false;
    return new Date(this.task.dueDate) < new Date() && !this.task.isCompleted;
  }
}
