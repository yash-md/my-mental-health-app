import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  standalone: true,
  imports: [NgIf, RouterModule, AsyncPipe]
})
export class Header implements OnDestroy {
  isLoggedIn$: Observable<boolean>;
  private authSubscription?: Subscription;

  showProfileDropdown = false;
  showServicesDropdown = false;

  constructor(private authService: Auth, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    this.authSubscription = this.isLoggedIn$.subscribe((loggedIn: boolean) => {
      if (!loggedIn && this.router.url !== '/auth') {
        this.router.navigate(['/auth']);
      }
    });
  }

  scrollToSection(id: string) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}
