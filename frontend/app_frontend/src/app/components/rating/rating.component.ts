import { Component, Input, OnInit } from '@angular/core';
import { Rating } from '../../interfaces/videojuegos';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating',
  imports: [CommonModule, RatingModule, FormsModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent implements OnInit {
  @Input()
  ratings: Rating[];

  @Input()
  averageRatings: number;

  userRatings: Rating[];

  constructor() {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.userRatings = this.ratings.filter((r) => r.usuario.id == userId);
    this.ratings = this.ratings.filter((r) => !this.userRatings.includes(r));
  }
}
