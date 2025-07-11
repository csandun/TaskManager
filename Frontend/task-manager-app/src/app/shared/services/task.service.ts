import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { TaskItem } from '../models/task-item.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private taskUrl = 'http://localhost:5062/api/tasks';
    private http = inject(HttpClient);

    private tasksSubject = new BehaviorSubject<TaskItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string | null>(null);

    public tasks$ = this.tasksSubject.asObservable();

    get currentTasks(): TaskItem[] {
        return this.tasksSubject.value;
    }

    loadTasksForUser(userId: number): Observable<TaskItem[]> {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        return this.http.get<TaskItem[]>(`${this.taskUrl}/user/${userId}`).pipe(
            tap(tasks => {
                this.tasksSubject.next(tasks);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                this.errorSubject.next(this.formatError(error));
                this.loadingSubject.next(false);
                this.tasksSubject.next([]);
                return throwError(() => error);
            })
        );
    }

    toggleTaskComplete(taskId: number, isCompleted: boolean): Observable<TaskItem> {
        return this.http.patch<TaskItem>(`${this.taskUrl}/${taskId}/complete?isCompleted=${isCompleted}`, {}).pipe(
            tap(updatedTask => {
                const currentTasks = this.currentTasks;
                const updatedTasks = currentTasks.map(task => {
                    if (task.id === taskId) {
                        return { ...task, isCompleted: isCompleted };
                    }
                    return task;
                });
                
                this.tasksSubject.next(updatedTasks);
            }),
            catchError(this.handleError.bind(this))
        );
    }

    createTask(task: Omit<TaskItem, 'id' | 'createdAt'>): Observable<TaskItem> {
        return this.http.post<TaskItem>(this.taskUrl, task).pipe(
            tap(newTask => {
                const currentTasks = this.currentTasks;
                this.tasksSubject.next([...currentTasks, newTask]);
            }),
            catchError(this.handleError.bind(this))
        );
    }

    updateTask(taskId: number, updates: Partial<TaskItem>): Observable<TaskItem> {
        return this.http.put<TaskItem>(`${this.taskUrl}/${taskId}`, updates).pipe(
            tap(updatedTask => {
                const currentTasks = this.currentTasks;
                const updatedTasks = currentTasks.map(task => 
                    task.id === taskId ? updatedTask : task
                );
                this.tasksSubject.next(updatedTasks);
            }),
            catchError(this.handleError.bind(this))
        );
    }

    deleteTask(taskId: number): Observable<void> {
        return this.http.delete<void>(`${this.taskUrl}/${taskId}`).pipe(
            tap(() => {
                const currentTasks = this.currentTasks;
                const filteredTasks = currentTasks.filter(task => task.id !== taskId);
                this.tasksSubject.next(filteredTasks);
            }),
            catchError(this.handleError.bind(this))
        );
    }

    getCompletedTasks(): TaskItem[] {
        return this.currentTasks.filter(task => task.isCompleted);
    }

    getPendingTasks(): TaskItem[] {
        return this.currentTasks.filter(task => !task.isCompleted);
    }

    getOverdueTasks(): TaskItem[] {
        return this.currentTasks.filter(task => 
            !task.isCompleted && 
            task.dueDate && 
            new Date(task.dueDate) < new Date()
        );
    }

    private formatError(error: any): string {
        if (error.error?.message) {
            return error.error.message;
        }
        if (error.message) {
            return error.message;
        }
        return 'An unknown error occurred';
    }

    private handleError(error: any): Observable<never> {
        this.errorSubject.next(this.formatError(error));
        return throwError(() => new Error(this.formatError(error)));
    }
}