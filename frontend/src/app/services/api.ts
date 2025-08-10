export interface PingResponse {
  message: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Api {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ping() {
    return this.http.get<PingResponse>(`${this.baseUrl}/ping`);
  }

  getProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser.username;
    return this.http.get<{ user: { username: string; name: string; email: string; phone: string; joined: string } }>(`${this.baseUrl}/profile/?username=${username}`);
  }

  updateProfile(profileData: { name: string; email: string; phone: string }) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser.username;
    const data = { ...profileData, username };
    return this.http.put(`${this.baseUrl}/profile/update/`, data);
  }

  saveJournalEntry(entry: { title: string; content: string; date: string }) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser.username;
    const entryData = { ...entry, username };
    return this.http.post(`${this.baseUrl}/journal-entry`, entryData);
  }

  getMoodAnalysis() {
    return this.http.get<{ mood: string; rating: number }>(`${this.baseUrl}/mood-analytics`);
  }

  getTips(username: string, date: string) {
    return this.http.get<{ tips: string[] }>(`${this.baseUrl}/tips?username=${username}&date=${date}`);
  }

  getMood(text: string, username: string, date: string) {
    return this.http.post(`${this.baseUrl}/mood/`, { text, username, date });
  }

  getJournalEntries(username: string | null) {
    return this.http.get<{ title: string; content: string; date: Date }[]>(`${this.baseUrl}/journal-entry?username=${username}`);
  }

  getJournalTips(username: string, journalDate: string) {
    return this.http.get<{ tips: string[] }>(`${this.baseUrl}/tips/journal?username=${username}&journal_date=${journalDate}`);
  }
}