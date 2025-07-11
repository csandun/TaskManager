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
    filteredTasks: TaskItem[] = [];
    isLoading: boolean = false;
    error: string | null = null;

    searchTerm: string = '';
    filterBy: string = 'all';
    sortBy: string = 'createdAt';

    ngOnInit() {
        this.subscriptions.add(
            this.taskService.tasks$.subscribe(tasks => {
                this.tasks = tasks;
                this.applyFiltersAndSort();
            })
        );

        this.loadTasks();
        this.applyFiltersAndSort();
    }

    private loadTasks() {
        this.isLoading = true;
        this.error = null;

        this.taskService.loadTasksForUser(1).subscribe({
            next: (tasks) => {
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.error = error.message;
            }
        });
    }

    onTaskToggle(taskId: number) {
        const currentTask = this.tasks.find(task => task.id === taskId);

        if (currentTask) {
            const newCompletionStatus = !currentTask.isCompleted;

            this.taskService.toggleTaskComplete(taskId, newCompletionStatus).subscribe({
                next: (updatedTask) => {
                    this.error = null;
                },
                error: (error) => {
                    this.error = error.message;
                    alert(`Failed to update task: ${error.message}`);
                }
            });
        }
    }

    onTaskDelete(taskId: number) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.taskService.deleteTask(taskId).subscribe({
                next: () => {
                    this.error = null;
                },
                error: (error) => {
                    this.error = error.message;
                    alert(`Failed to delete task: ${error.message}`);
                }
            });
        }
    }

    onTaskEdit(taskId: number) {
    }

    onAddTask() {
        const newTask = {
            title: 'New Task from UI',
            description: 'Task created from the user interface',
            isCompleted: false,
            priority: TaskPriority.MEDIUM,
            dueDate: new Date(),
            userId: 1
        };

        this.taskService.createTask(newTask).subscribe({
            next: (createdTask) => {
                this.error = null;
            },
            error: (error) => {
                this.error = error.message;
                alert(`Failed to create task: ${error.message}`);
            }
        });
    }

    onSearchTermChange(searchTerm: string) {
        this.searchTerm = searchTerm;
        this.applyFiltersAndSort();
    }

    onFilterByChange(filterBy: string) {
        this.filterBy = filterBy;
        this.applyFiltersAndSort();
    }

    onSortByChange(sortBy: string) {
        this.sortBy = sortBy;
        this.applyFiltersAndSort();
    }

    private applyFiltersAndSort() {
        let filtered = [...this.tasks];

        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchLower)
            );
        }

        switch (this.filterBy) {
            case 'completed':
                filtered = filtered.filter(task => task.isCompleted);
                break;
            case 'pending':
                filtered = filtered.filter(task => !task.isCompleted);
                break;
            case 'overdue':
                filtered = filtered.filter(task =>
                    !task.isCompleted &&
                    task.dueDate &&
                    new Date(task.dueDate) < new Date()
                );
                break;
            case 'all':
            default:
                break;
        }

        filtered.sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
            }

            switch (this.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                case 'priority':
                    return b.priority - a.priority;
                case 'createdAt':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        this.filteredTasks = filtered;
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

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
