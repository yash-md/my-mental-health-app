import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', loadComponent: () => import('./auth-page/auth-page').then(m => m.AuthPage) },

  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/homepage/homepage').then(m => m.Homepage)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/profile/profile').then(m => m.Profile)
  },
  {
    path: 'journal',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/journal-entry/journal-entry').then(m => m.JournalEntry)
  },
  {
    path: 'mood-analytics',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/mood-analytics/mood-analytics').then(m => m.MoodAnalytics)
  },
  {
    path: 'tips',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/tips/tips').then(m => m.Tips)
  },
  {
    path: 'history',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/history/history').then(m => m.History)
  },
  {
    path: 'edit-profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/edit-profile/edit-profile').then(m => m.EditProfileComponent)
  },
  {
    path: 'change-password',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/change-password/change-password').then(m => m.ChangePasswordComponent)
  },
  {
    path: 'view-entry',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/view-entry/view-entry').then(m => m.ViewEntry)
  }
    
];
