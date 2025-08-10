import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-intro.html',
  styleUrl: './logo-intro.css',
})
export class LogoIntro {
  show = true;

  ngOnInit() {
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
}
