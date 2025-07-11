import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/login.service';
import { LoginRequest } from '../../../shared/models/user.model';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tasks']);
    }
  }

  login() {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = null;

      const credentials: LoginRequest = this.form.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.message;
        }
      });
    }
  }
}
