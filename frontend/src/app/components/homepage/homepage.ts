import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
  imports: [Header, RouterModule]
})
export class Homepage {}
