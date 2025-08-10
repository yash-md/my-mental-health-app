import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { CommonModule, NgIf } from '@angular/common';
import { Header } from "../header/header";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf, Header],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: Api
  ) {
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.apiService.getProfile().subscribe(
      (response) => {
        this.editProfileForm.patchValue({
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone
        });
      },
      (error) => {
        this.errorMessage = 'Failed to load profile data.';
        console.warn('Error loading profile:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      this.apiService.updateProfile(this.editProfileForm.value).subscribe(
        (response) => {
          this.successMessage = 'Profile updated successfully!';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Failed to update profile.';
          this.successMessage = '';
          console.warn('Error updating profile:', error);
        }
      );
    }
  }
}
