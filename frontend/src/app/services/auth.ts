import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:8000/auth';
  private currentUser: any = null;
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    const stored = localStorage.getItem('currentUser');
    console.log('Checking login status, stored user:', stored);
    
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        this.isLoggedInSubject.next(true);
        console.log('User found in storage, setting logged in to true');
      } catch (e) {
        console.log('Error parsing stored user, clearing storage');
        localStorage.removeItem('currentUser');
        this.isLoggedInSubject.next(false);
      }
    } else {
      this.isLoggedInSubject.next(false);
      console.log('No user in storage, setting logged in to false');
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { username, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  changePassword(data: { username: string, current_password: string, new_password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password/`, data);
  }

  setLoggedIn(user: any) {
    console.log('setLoggedIn called with user:', user);
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
    console.log('Observable updated to true');
  }

  isLoggedIn(): boolean {
    const loggedIn = this.currentUser !== null || localStorage.getItem('currentUser') !== null;
    console.log('isLoggedIn() called, returning:', loggedIn);
    return loggedIn;
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      this.currentUser = stored ? JSON.parse(stored) : null;
    }
    return this.currentUser;
  }

  logout() {
    console.log('Logout called');
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.isLoggedInSubject.next(false);
  }
}
