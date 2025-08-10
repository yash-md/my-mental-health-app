import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Header } from "../header/header";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'], // fixed property name
  imports: [Header, CommonModule, RouterLink]
})
export class Profile implements OnInit {
  user: { username: string, name: string, email: string, phone: string } | null = null;

  // Add missing properties
  message: string = '';
  isError: boolean = false;

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.apiService.getProfile().subscribe({
      next: (response: any) => {
        this.user = response.user;
      },
      error: (error: any) => {
        this.message = error.error?.error || 'Failed to load profile data.';
        this.isError = true;
        console.warn('Error loading profile:', error);
      }
    });
  }
}
