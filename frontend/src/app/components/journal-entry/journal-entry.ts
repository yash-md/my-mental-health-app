import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { Header } from '../header/header';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'journal-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule, Header, NgIf],
  templateUrl: './journal-entry.html',
  styleUrls: ['./journal-entry.css']
})
export class JournalEntry implements OnInit, OnDestroy {
  journalForm: FormGroup;
  editor: Editor;
  prompt: string;
  successMessage: string = '';

  private prompts = [
    'What was the best part of your day?',
    'What is something that has been on your mind lately?',
    'What are you grateful for today?',
    'Describe a challenge you faced and how you overcame it.',
    'What is a goal you want to achieve this week?'
  ];

  constructor(private fb: FormBuilder, private api: Api, private router: Router) {
    this.journalForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]]
    });
    this.editor = new Editor();
    this.prompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  submitEntry() {
    if (this.journalForm.valid) {
      const entry = { ...this.journalForm.value, date: new Date().toISOString() };
      this.api.saveJournalEntry(entry).subscribe({
        next: () => {
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          const username = currentUser.username;
          this.api.getMood(entry.content, username, entry.date).subscribe({
            next: (response: any) => {
              this.router.navigate(['/mood-analytics'], { 
                queryParams: { mood: response.mood, analysis: response.analysis, date: entry.date } 
              });
              setTimeout(() => {
                this.successMessage = 'Your personalized tips have been generated! You can view them on the tips page.';
              }, 2000);
            },
            error: (error) => {
              console.error('Error getting mood:', error);
            }
          });
        },
        error: (error) => {
                  console.warn('Journal entry error:', error);
        }
      });
    }
  }

  goToMoodAnalysis(): void {
    this.router.navigate(['/mood-analytics']);
  }

  goToHistory(): void {
    this.router.navigate(['/history']);
  }
}
