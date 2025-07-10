import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskItem, TaskPriority } from '../../../shared/models/task-item.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
    standalone: true,
    selector: 'app-task-list',
    imports: [
        CommonModule,
        FormsModule,
        TaskItemComponent
    ],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
    @Input() tasks: TaskItem[] = [];
    @Output() taskToggle = new EventEmitter<number>();
    @Output() taskDelete = new EventEmitter<number>();
    @Output() taskEdit = new EventEmitter<number>();

    onTaskToggle(taskId: number) {
        this.taskToggle.emit(taskId);
    }

    onTaskDelete(taskId: number) {
        this.taskDelete.emit(taskId);
    }

    onTaskEdit(taskId: number) {
        this.taskEdit.emit(taskId);
    }
}
