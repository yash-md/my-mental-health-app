import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoIntro } from "./logo-intro/logo-intro";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, LogoIntro, NgIf],
})

export class App {
  showIntro = true;

  constructor() {
    setTimeout(() => {
      this.showIntro = false;
    }, 2500);
  }

}

