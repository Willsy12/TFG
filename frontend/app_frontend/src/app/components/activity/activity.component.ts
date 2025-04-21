import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Friendship, User, Rating, WishList } from '../../interfaces/videojuegos';
import { MatIcon } from '@angular/material/icon';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSpinner } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-activity',
  imports: [MatIcon, RatingModule, CommonModule, FormsModule, MatSpinner, RouterModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class ActivityComponent implements OnInit {
  ratings: Rating[] = [];
  user: Friendship[] = [];
  wishList: WishList[] = [];
  playedList: WishList[] = [];
  loading: boolean = true;
  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.loading = true;
    this.searchService.searchFriendShips().subscribe({
      next: (result: Friendship[]) => {
        this.user = result;

        this.searchService.searchAllVideogameRating().subscribe({
          next: (ratings: Rating[]) => {
            this.ratings = ratings.filter((rating) =>
              this.user.some(
                (friend) =>
                  (friend.usuario1.id === rating.usuario.id ||
                    friend.usuario2.id === rating.usuario.id) &&
                  rating.usuario.id != localStorage.getItem('userId')
              )
            );
          },
        });

        this.searchService.searchVideogameInList().subscribe({
          next: (wishLists: WishList[]) => {
            this.wishList = wishLists.filter((wish) =>
              this.user.some(
                (friend) =>
                  (friend.usuario1.id === wish.idUsuario.id ||
                    friend.usuario2.id === wish.idUsuario.id) &&
                  wish.idUsuario.id !== localStorage.getItem('userId')
              )
            );

            this.playedList = this.wishList.filter((w) => w.isPlayedList);
            this.wishList = this.wishList.filter((w) => !w.isPlayedList);
            console.log(this.wishList);
          },
        });

        this.loading = false;
      },
    });
  }
}
