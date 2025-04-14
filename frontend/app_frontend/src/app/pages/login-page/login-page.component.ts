import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Route, Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LoginPageComponent implements OnInit {
  loginFunction: boolean = false;
  userForm!: FormGroup;
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  hide = signal(true);

  ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    });
  }
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: (response: any) => {
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('token', response.auth_token);
        this.router.navigate(['/']);
      },
      error: (response) => {
        Object.entries(response.error).forEach(([key, errors]) => {
          this.showErrorMessage = true;

          (errors as string[]).forEach((errMsg) => {
            this.errorMessage = errMsg;
          });
        });
      },
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  changeFunction(value: boolean) {
    const new_email = value ? 'default@defualt.com' : '';
    this.userForm.setValue({ password: '', email: new_email, username: '' });
    this.loginFunction = value;
    this.showErrorMessage = false;
  }

  register(email: string, username: string, password: string) {
    this.authService.register(email, username, password).subscribe({
      next: (response: any) => {
        this.changeFunction(true);
      },
      error: (response) => {
        this.showErrorMessage = true;

        Object.entries(response.error).forEach(([key, errors]) => {
          this.showErrorMessage = true;

          (errors as string[]).forEach((errMsg) => {
            this.errorMessage = errMsg;
          });
        });
      },
    });
  }

  onSubmit() {
    if (!this.userForm.invalid) {
      if (this.loginFunction) {
        const response = this.login(
          this.userForm.get('username')?.value,
          this.userForm.get('password')?.value
        );
      } else {
        const response = this.register(
          this.userForm.get('email')?.value,
          this.userForm.get('username')?.value,
          this.userForm.get('password')?.value
        );
      }
    } else {
      this.showErrorMessage = true;
      this.errorMessage = 'Todos los campos son obligatorios';
    }
  }
}
