import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-task-controls',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './task-controls.component.html',
    styleUrl: './task-controls.component.scss'
})
export class TaskControlsComponent {

    @Output() searchTermChange = new EventEmitter<string>();
    @Output() filterByChange = new EventEmitter<string>();
    @Output() sortByChange = new EventEmitter<string>();
    @Output() addTask = new EventEmitter<void>();

    private _searchTerm: string = '';
    private _filterBy: string = 'all';
    private _sortBy: string = 'createdAt';

    get searchTerm(): string {
        return this._searchTerm;
    }

    set searchTerm(value: string) {
        this._searchTerm = value;
        this.searchTermChange.emit(value);
    }

    get filterBy(): string {
        return this._filterBy;
    }

    set filterBy(value: string) {
        this._filterBy = value;
        this.filterByChange.emit(value);
    }

    get sortBy(): string {
        return this._sortBy;
    }

    set sortBy(value: string) {
        this._sortBy = value;
        this.sortByChange.emit(value);
    }

    filterOptions = [
        { value: 'all', label: 'All Tasks' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'overdue', label: 'Overdue' }
    ];

    sortOptions = [
        { value: 'createdAt', label: 'Created Date' },
        { value: 'dueDate', label: 'Due Date' },
        { value: 'priority', label: 'Priority' },
        { value: 'title', label: 'Title' }
    ];

    onAddTask() {
        this.addTask.emit();
    }
}
