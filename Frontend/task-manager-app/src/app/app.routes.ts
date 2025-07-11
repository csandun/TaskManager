import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/login' }
];
