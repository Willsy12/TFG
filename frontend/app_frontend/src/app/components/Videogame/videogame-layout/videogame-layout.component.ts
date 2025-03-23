import { Component, OnInit } from '@angular/core';
import { VideogameListComponent } from '../videogame-list/videogame-list.component';
import { VideogameFilterComponent } from '../videogame-filter/videogame-filter.component';
import { PaginatorComponent } from '../../material/paginator/paginator.component';
import { Genero } from '../../../interfaces/genero.enum';
import { Videojuegos } from '../../../interfaces/videojuegos';
import { VideojuegosFilter } from '../../../interfaces/videojuegos-filter';
import { SearchService } from '../../../services/search.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-videogame-layout',
  imports: [
    VideogameListComponent,
    VideogameFilterComponent,
    PaginatorComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './videogame-layout.component.html',
  styleUrl: './videogame-layout.component.scss',
})
export class VideogameLayoutComponent implements OnInit {
  videogames: Videojuegos[] = [];
  pagedVideogames: Videojuegos[][] = [];
  totalVideogames: Videojuegos[] = [];
  loading: boolean = true;
  totalPages: number = 0;
  maxNumberVideogames: number = 9;
  currentPage: number = 0;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchVideogameItems();
  }

  searchVideogameItems() {
    this.loading = true;
    this.searchService.searchVideogames().subscribe({
      next: (result: Videojuegos[]) => {
        this.paginateVidegames(result);
        this.videogames = this.pagedVideogames.at(this.currentPage) ?? [];
        this.totalPages = Math.ceil(result.length / this.maxNumberVideogames);
        this.loading = false;
      },
    });
  }

  searchFilterVideogame(filterVideogameForm: VideojuegosFilter) {
    this.searchService.searchVideogamesWithFilters(filterVideogameForm).subscribe({
      next: (result: Videojuegos[]) => (this.videogames = result),
    });
    this.totalPages = Math.ceil(this.videogames.length / this.maxNumberVideogames);
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

  clearFilters(any: any) {
    this.router.navigate([this.router.url]);
    this.searchVideogameItems();
  }
}
