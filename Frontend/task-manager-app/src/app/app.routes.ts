import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { TasksComponent } from './features/tasks/tasks.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'tasks', component: TasksComponent },
];
