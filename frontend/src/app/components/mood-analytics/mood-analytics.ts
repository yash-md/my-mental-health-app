import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'mood-analytics',
  standalone: true,
  imports: [CommonModule, NgIf, Header],
  templateUrl: './mood-analytics.html',
  styleUrls: ['./mood-analytics.css']
})
export class MoodAnalytics implements OnInit {
  mood: string | null = null;
  analysis: string | null = null;
  showTipsButton = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.mood = params['mood'];
      this.analysis = params['analysis'];
    });

    setTimeout(() => {
      this.showTipsButton = true;
    }, 4500); 
  }

  getMoodEmoji(mood: string | null): string {
    if (!mood) return '🙂';
    const lowerCaseMood = mood.toLowerCase();
    if (lowerCaseMood.includes('happy')) return '😊';
    if (lowerCaseMood.includes('sad')) return '😢';
    if (lowerCaseMood.includes('anxious')) return '😟';
    if (lowerCaseMood.includes('calm')) return '😌';
    if (lowerCaseMood.includes('excited')) return '😃';
    if (lowerCaseMood.includes('angry')) return '😠';
    if (lowerCaseMood.includes('tired')) return '😴';
    return '🙂';
  }

  goToTipsPage(): void {
    this.router.navigate(['/tips'], { queryParams: { date: this.route.snapshot.queryParams['date'] } });
  }
}