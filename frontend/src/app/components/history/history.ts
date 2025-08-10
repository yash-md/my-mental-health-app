import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Header } from '../header/header';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class History implements OnInit {
  allEntries: { title: string; content: string; date: Date }[] = [];
  displayedEntries: { title: string; content: string; date: Date }[] = [];
  currentPage = 1;
  entriesPerPage = 10;

  // Add missing properties
  message: string = '';
  isError: boolean = false;

  constructor(private api: Api, private router: Router) { }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser.username;
    this.api.getJournalEntries(username).subscribe({
      next: (data) => {
        this.allEntries = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.updateDisplayedEntries();
      },
      error: (error: any) => {
        this.message = error.error?.message || 'Failed to load journal entries.';
        this.isError = true;
        console.warn('Error loading journal entries:', error);
      }
    });
  }

  viewEntry(entry: { title: string; content: string; date: Date }): void {
    this.router.navigate(['/view-entry'], { state: { entry } });
  }

  updateDisplayedEntries(): void {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    this.displayedEntries = this.allEntries.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage * this.entriesPerPage < this.allEntries.length) {
      this.currentPage++;
      this.updateDisplayedEntries();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedEntries();
    }
  }

  goToMoodAnalysis(): void {
    this.router.navigate(['/mood-analytics']);
  }

  goToJournal(): void {
    this.router.navigate(['/journal']);
  }

  viewTipsForEntry(entry: { title: string; content: string; date: Date }): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser.username;
    this.router.navigate(['/tips'], { queryParams: { username: username, date: entry.date } });
  }

  stripHtmlTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
