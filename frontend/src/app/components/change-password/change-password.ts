import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Header } from "../header/header";

@Component({
  selector: 'app-change-password',
  standalone: true,
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Header]
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
    ]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: (group) => {
      const newPassword = group.get('newPassword')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }
  });

  showPasswords = false;
  error = '';
  successMessage = ''; 
  private successTimeout: any;

  passwordConditions = {
    minLength: false,
    uppercase: false,
    number: false
  };

  ngOnInit() {
    this.form.get('newPassword')?.valueChanges.subscribe(() => this.onPasswordInput());
  }

  ngOnDestroy() {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }

  get f() { 
    return this.form.controls; 
  }

  onPasswordInput() {
    const val = this.form.get('newPassword')?.value || '';
    this.passwordConditions.minLength = val.length >= 8;
    this.passwordConditions.uppercase = /[A-Z]/.test(val);
    this.passwordConditions.number = /\d/.test(val);
  }

  submit() {
    this.error = '';
    this.successMessage = ''; 
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.errors?.['passwordMismatch']) {
        this.error = 'New passwords do not match';
      } else {
        this.error = 'Please fix the highlighted fields';
      }
      return;
    }

    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      this.error = 'Please login first';
      this.router.navigate(['/auth']);
      return;
    }

    const currentPassword = this.form.get('currentPassword')?.value;
    const newPassword = this.form.get('newPassword')?.value;

    if (!currentPassword || !newPassword) {
      this.error = 'All fields are required';
      return;
    }

    const payload = {
      username: currentUser.username,
      current_password: currentPassword,
      new_password: newPassword
    };

    this.auth.changePassword(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Password changed successfully! 🎉';
          this.form.reset();
          this.showPasswords = false;
          
          this.successTimeout = setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        } else {
          this.error = res.message || 'Could not change password';
        }
      },
      error: (err) => {
                console.warn('Change password error:', this.error);
        if (err.status === 400 && err.error?.message) {
          this.error = err.error.message;
        } else if (err.status === 404) {
          this.error = 'User not found';
        } else {
          this.error = 'Server error. Please try again later.';
        }
      }
    });
  }
}
