import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-view-entry',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './view-entry.html',
  styleUrls: ['./view-entry.css']
})
export class ViewEntry implements OnInit {
  entry: { title: string; content: string; date: Date } | undefined;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.entry = history.state.entry;
  }

  goBack(): void {
    this.router.navigate(['/history']);
  }

  stripHtmlTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
