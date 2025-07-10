import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskItem, TaskPriority } from '../../shared/models/task-item.model';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskControlsComponent } from "./task-controls/task-controls.component";
import { TaskService } from '../../shared/services/task.service';

@Component({
    standalone: true,
    selector: 'app-tasks',
    imports: [
        CommonModule,
        TaskListComponent,
        TaskControlsComponent
    ],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit, OnDestroy {

    private taskService = inject(TaskService);
    private subscriptions = new Subscription();

    tasks: TaskItem[] = [];
    isLoading: boolean = false;
    error: string | null = null;
   
    ngOnInit() {
        this.subscriptions.add(
            this.taskService.tasks$.subscribe(tasks => {
                this.tasks = tasks;
            })
        );

        this.loadTasks();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private loadTasks() {
        this.isLoading = true;
        this.error = null;
        
        this.taskService.loadTasksForUser(1).subscribe({
            next: (tasks) => {
                this.isLoading = false;
                console.log('Tasks loaded successfully:', tasks);
            },
            error: (error) => {
                this.isLoading = false;
                this.error = error.message || 'Failed to load tasks';
                console.error('Failed to load tasks:', error);
            }
        });
    }

    onTaskToggle(taskId: number) {
        const currentTask = this.tasks.find(task => task.id === taskId);
        if (currentTask) {
            const newCompletionStatus = !currentTask.isCompleted;
            
            this.taskService.toggleTaskComplete(taskId, newCompletionStatus).subscribe({
                next: (updatedTask) => {
                    console.log('Task completion toggled successfully:', updatedTask);
                    this.error = null; 
                },
                error: (error) => {
                    console.error('Failed to toggle task completion:', error);
                    this.error = error.message || 'Failed to update task';
                    alert(`Failed to update task: ${error.message}`);
                }
            });
        }
    }

    onTaskDelete(taskId: number) {
        
    }

    onTaskEdit(taskId: number) {
        
    }

    onAddTask() {
       
    }

    get completedTasks(): TaskItem[] {
        return this.taskService.getCompletedTasks();
    }

    get pendingTasks(): TaskItem[] {
        return this.taskService.getPendingTasks();
    }

    get overdueTasks(): TaskItem[] {
        return this.taskService.getOverdueTasks();
    }
}
