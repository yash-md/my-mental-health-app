import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, FormsModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css'
})
export class AuthPage implements OnInit { 
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showPassword = false;
  showConfirmPassword = false; 
  isLogin = true;
  error = '';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  registerForm: FormGroup = this.fb.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    username: ['', Validators.required],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
    ]],
    confirm_password: ['', Validators.required]
  }, {
    validators: (group) => {
      const pass = group.get('password')?.value;
      const confirm = group.get('confirm_password')?.value;
      return pass === confirm ? null : { passwordMismatch: true };
    }
  });

  passwordConditions = {
    minLength: false,
    uppercase: false,
    number: false
  };

  constructor(public authService: Auth) { }

  ngOnInit() {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.onPasswordInput();
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    
    setTimeout(() => {
      const checkbox = document.querySelector('.container input[type="checkbox"]') as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = this.showPassword;
      }
    }, 0);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
    this.showPassword = false; 
    this.showConfirmPassword = false;
    this.loginForm.reset();
    this.registerForm.reset();
    this.passwordConditions = {
      minLength: false,
      uppercase: false,
      number: false
    };
  }

  onPasswordInput() {
    const value = this.registerForm.get('password')?.value || '';
    this.passwordConditions.minLength = value.length >= 8;
    this.passwordConditions.uppercase = /[A-Z]/.test(value);
    this.passwordConditions.number = /[0-9]/.test(value);
  }

  submitForm() {
    this.error = '';

    if (this.isLogin) {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        this.error = 'Please fill in both username and password';
        return;
      }

      const { username, password } = this.loginForm.value;

      this.authService.login(username!, password!).subscribe({
        next: (res) => {
          if (res.success) {
            this.authService.setLoggedIn(res.user);

            this.router.navigate(['/home']);
          } else {
            this.error = res.message || 'Invalid username or password';
          }
        },
        error: (err) => {
          console.warn('Login error:', err);
          if (err.status === 400 || err.status === 401) {
            this.error = 'Username or password does not match';
          } else {
            this.error = 'Something went wrong. Please try again later.';
          }
        }
      });

    } else {
      if (this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();

        if (this.registerForm.errors?.['passwordMismatch']) {
          this.error = 'Passwords do not match';
          return;
        }

        this.error = 'Please fix the highlighted fields';
        return;
      }

      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirm_password')?.value;

      if (password !== confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      const formValue = {
        username: this.registerForm.get('username')?.value,
        password: this.registerForm.get('password')?.value,
        full_name: this.registerForm.get('full_name')?.value,
        email: this.registerForm.get('email')?.value,
        phone: this.registerForm.get('phone')?.value
      };

      this.authService.register(formValue).subscribe({
        next: (res) => {
          if (res.success) {
            this.isLogin = true;
            this.error = '';
            this.showPassword = false; 
            this.showConfirmPassword = false;
            this.loginForm.reset();
            this.registerForm.reset();

            this.loginForm.patchValue({
              username: formValue.username
            });

            alert('Registration successful! Please login with your credentials.');
          } else {
            this.error = res.message || 'Registration failed';
          }
        },
        error: (err) => {
          console.warn('Registration error:', err);

          if (err.status === 400) {
            if (err.error && err.error.message) {
              this.error = err.error.message;

              if (err.error.error_type === 'username_exists') {
                this.registerForm.get('username')?.setErrors({ 'usernameTaken': true });
              } else if (err.error.error_type === 'email_exists') {
                this.registerForm.get('email')?.setErrors({ 'emailTaken': true });
              }
            } else if (err.error && typeof err.error === 'string') {
              this.error = err.error;
            } else {
              this.error = 'Registration failed. Please check your input.';
            }
          } else if (err.status === 500) {
            this.error = 'Server error. Please try again later.';
          } else {
            this.error = 'Registration failed. Please try again.';
          }
        }
      });
    }
  }

  get usernameControl() {
    return this.isLogin ? this.loginForm.get('username') : this.registerForm.get('username');
  }

  get passwordControl() {
    return this.isLogin ? this.loginForm.get('password') : this.registerForm.get('password');
  }
}
