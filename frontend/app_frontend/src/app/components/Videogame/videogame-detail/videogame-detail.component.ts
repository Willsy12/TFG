import { Component, Input, OnInit } from '@angular/core';
import { Videojuegos } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of, switchMap, throwError } from 'rxjs';
import { genreMap } from '../../../interfaces/genero.enum';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { UpdateService } from '../../../services/update.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-videogame-detail',
  imports: [MatIcon, RouterModule, CommonModule],
  templateUrl: './videogame-detail.component.html',
  styleUrl: './videogame-detail.component.scss',
})
export class VideogameDetailComponent implements OnInit {
  videogame: Videojuegos;
  genreMap = genreMap;
  wishListTag: boolean = false;
  playedListTag: boolean = false;

  constructor(
    private searchService: SearchService,
    private updateService: UpdateService,
    private route: ActivatedRoute,
    private location: Location,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          return id ? of(id) : throwError(() => new Error('ID not found'));
        })
      )
      .subscribe({
        next: (id: string) => {
          this.loadVideogameDetail(id);
        },
        error: (err) => console.error(err),
      });
  }

  loadVideogameDetail(id: string) {
    this.getVideogameDetail(id);
    this.isVideogameInPlayedList(id);
    this.isVideogameInWishList(id);
  }

  goBack(): void {
    this.location.back(); // Navega a la página anterior
  }
  getVideogameDetail(id: string) {
    this.searchService.searchVideogameDetail(id).subscribe({
      next: (videogame: Videojuegos) => {
        this.videogame = videogame;
      },
    });
  }

  addVideogameWishList() {
    this.updateService.addVideogameInWishList(this.videogame.id).subscribe({
      next: (response: boolean) => {
        this.openSnackBar('Videojuego añadido a la lista de deseos');
        this.loadVideogameDetail(this.videogame.id);
      },
    });
  }
  addVideogamePlayedList() {
    this.updateService.addVideogameInPlayedList(this.videogame.id).subscribe({
      next: (response: boolean) => {
        this.openSnackBar('Videojuego añadido a la lista de jugados');
        this.loadVideogameDetail(this.videogame.id);
      },
    });
  }

  deleteVideogameWishList() {
    this.updateService.deleteVideogameInWishList(this.videogame.id).subscribe({
      next: (response: boolean) => {
        this.openSnackBar('Videojuego eliminado a la lista de deseos');
        this.loadVideogameDetail(this.videogame.id);
      },
    });
  }
  deleteVideogamePlayedList() {
    this.updateService.deleteVideogameInPlayedList(this.videogame.id).subscribe({
      next: (response: boolean) => {
        this.openSnackBar('Videojuego eliminado a la lista de jugados');

        this.loadVideogameDetail(this.videogame.id);
      },
    });
  }

  isVideogameInWishList(id: string) {
    this.searchService.checkVideogameIsWishList(id).subscribe({
      next: (response: boolean) => {
        this.wishListTag = response;
      },
    });
  }
  isVideogameInPlayedList(id: string) {
    this.searchService.checkVideogameIsPlayedList(id).subscribe({
      next: (response: boolean) => {
        this.playedListTag = response;
      },
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
