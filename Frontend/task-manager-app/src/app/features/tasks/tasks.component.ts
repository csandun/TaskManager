import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TaskItem, TaskPriority } from '../../shared/models/task-item.model';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskControlsComponent } from "./task-controls/task-controls.component";
import { TaskService } from '../../shared/services/task.service';
import { AuthService } from '../../shared/services/login.service';

@Component({
    standalone: true,
    selector: 'app-tasks',
    imports: [
        CommonModule,
        FormsModule,
        MatSidenavModule,
        MatIconModule,
        MatToolbarModule,
        TaskListComponent,
        TaskControlsComponent
    ],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit, OnDestroy {

    private taskService = inject(TaskService);
    private authService = inject(AuthService);
    private subscriptions = new Subscription();

    tasks: TaskItem[] = [];
    filteredTasks: TaskItem[] = [];
    isLoading: boolean = false;
    error: string | null = null;
    currentUser: any = null;

    searchTerm: string = '';
    filterBy: string = 'all';
    sortBy: string = 'createdAt';

    showAddTaskSlider: boolean = false;
    isEditMode: boolean = false;
    editingTaskId: number | null = null;
    newTask = {} as TaskItem;

    TaskPriority = TaskPriority;

    ngOnInit() {
        this.subscriptions.add(
            this.authService.currentUser$.subscribe(user => {
                this.currentUser = user;
            })
        );

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

        this.taskService.loadTasksForUser().subscribe({
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
        const taskToEdit = this.tasks.find(task => task.id === taskId);
        if (taskToEdit) {
            this.isEditMode = true;
            this.editingTaskId = taskId;
            this.newTask = {
                id: taskToEdit.id,
                title: taskToEdit.title,
                description: taskToEdit.description || '',
                priority: taskToEdit.priority,
                dueDate: taskToEdit.dueDate 
            } as TaskItem;
            this.showAddTaskSlider = true;
        }
    }

    onAddTask() {
        this.isEditMode = false;
        this.editingTaskId = null;
        this.resetNewTaskForm();
        this.showAddTaskSlider = true;
    }

    onCloseAddTaskSlider() {
        this.showAddTaskSlider = false;
        this.isEditMode = false;
        this.editingTaskId = null;
        this.resetNewTaskForm();
    }

    onSaveNewTask() {
        if (!this.newTask.title.trim()) {
            alert('Task title is required');
            return;
        }

        if (this.isEditMode && this.editingTaskId) {
            this.updateExistingTask();
        } else {
            this.createNewTask();
        }
    }

    private createNewTask() {
        const taskToCreate = {
            title: this.newTask.title.trim(),
            description: this.newTask.description?.trim(),
            isCompleted: false,
            priority: +this.newTask.priority, // Convert to number
            dueDate: this.newTask.dueDate ? new Date(this.newTask.dueDate) : undefined,
            userId: this.currentUser?.id || 1
        } as TaskItem;

        this.taskService.createTask(taskToCreate).subscribe({
            next: (createdTask) => {
                this.error = null;
                this.onCloseAddTaskSlider();
            },
            error: (error) => {
                this.error = error.message;
                alert(`Failed to create task: ${error.message}`);
            }
        });
    }

    private updateExistingTask() {
        if (!this.editingTaskId) return;

        const updates = {
            id: this.editingTaskId,
            title: this.newTask.title.trim(),
            description: this.newTask.description?.trim(),
            priority: +this.newTask.priority, 
            dueDate: this.newTask.dueDate ? new Date(this.newTask.dueDate) : undefined
        };

        this.taskService.updateTask(this.editingTaskId, updates).subscribe({
            next: (updatedTask) => {
                this.error = null;
                this.onCloseAddTaskSlider();
            },
            error: (error) => {
                this.error = error.message;
                alert(`Failed to update task: ${error.message}`);
            }
        });
    }

    private resetNewTaskForm() {
        this.newTask = {
            title: '',
            description: '',
            priority: TaskPriority.MEDIUM,
            dueDate: undefined
        } as TaskItem;
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

    get completedTasks() {
        return this.taskService.getCompletedTasks();
    }

    get pendingTasks() {
        return this.taskService.getPendingTasks();
    }


    get overdueTasks(){
        return this.taskService.getOverdueTasks();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
