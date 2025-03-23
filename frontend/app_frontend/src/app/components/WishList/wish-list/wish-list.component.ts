import { Component, OnInit } from '@angular/core';
import { Videojuegos, WishList } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { VideogameListComponent } from '../../Videogame/videogame-list/videogame-list.component';
import { PaginatorComponent } from '../../material/paginator/paginator.component';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-wish-list',
  imports: [VideogameListComponent, PaginatorComponent, MatProgressSpinnerModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss',
})
export class WishListComponent implements OnInit {
  videogames: Videojuegos[] = [];
  wishList: WishList[] = [];
  pagedVideogames: Videojuegos[][] = [];
  totalVideogames: Videojuegos[] = [];

  totalPages: number = 0;
  maxNumberVideogames: number = 9;
  currentPage: number = 0;
  loading: boolean = true;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const routeName = this.route.snapshot.routeConfig?.path; // Obtén el nombre de la ruta activa

    if (routeName === 'WishList') {
      this.loadWishList(); // Carga la lista de deseos
    } else if (routeName === 'PlayedList') {
      this.loadPlayedList(); // Carga la lista de juegos jugados
    }
  }

  loadWishList() {
    this.loading = true;
    this.searchService.searchVideogameInWishList().subscribe({
      next: (wishList: WishList[]) => {
        this.wishList = wishList;
        const result = this.wishList.map((w) => w.videojuego);
        this.paginateVidegames(result);
        this.videogames = this.pagedVideogames.at(this.currentPage) ?? [];
        this.totalPages = Math.ceil(result.length / this.maxNumberVideogames);
        this.loading = false;
      },
    });
  }

  loadPlayedList() {
    this.loading = true;
    this.searchService.searchVideogameInPlayedList().subscribe({
      next: (wishList: WishList[]) => {
        this.wishList = wishList;
        const result = this.wishList.map((w) => w.videojuego);
        this.paginateVidegames(result);
        this.videogames = this.pagedVideogames.at(this.currentPage) ?? [];
        this.totalPages = Math.ceil(result.length / this.maxNumberVideogames);
        this.loading = false;
      },
    });
  }

  paginateVidegames(videogames: Videojuegos[]) {
    const result: Videojuegos[][] = [];
    for (let i = 0; i < videogames.length; i += this.maxNumberVideogames) {
      result.push(videogames.slice(i, i + this.maxNumberVideogames));
    }
    this.pagedVideogames = result;
  }

  nextPage(page: number) {
    this.videogames = this.pagedVideogames.at(page - 1) ?? [];
  }
}
