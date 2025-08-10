import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Header } from '../header/header';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './tips.html',
  styleUrls: ['./tips.css']
})
export class Tips implements OnInit {
  tips: string[] = [];
  loading: boolean = true;

  constructor(private api: Api, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser.username;
    this.route.queryParams.subscribe(params => {
      const date = params['date'];
      console.log('Fetching tips for date:', date);
      if (date) {
        this.api.getTips(username, date).subscribe({
          next: (response: any) => {
            console.log('Tips API response:', response);
            this.tips = response.tips;
            this.loading = false;
          },
          error: (error) => {
                    console.warn('Tips error:', error);
            this.loading = false;
          }
        });
      } else {
        console.log('No date parameter found for tips.');
        this.loading = false;
      }
    });
  }
  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToHistory(): void {
    this.router.navigate(['/history']);
  }
}