import { Component, Input, OnInit } from '@angular/core';
import { Videojuegos } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of, switchMap, throwError } from 'rxjs';
import { genreMap } from '../../../interfaces/genero.enum';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videogame-detail',
  imports: [MatIcon, RouterModule],
  templateUrl: './videogame-detail.component.html',
  styleUrl: './videogame-detail.component.scss',
})
export class VideogameDetailComponent implements OnInit {
  @Input()
  previousPageTarget: string = '/Inicio';
  videogame: Videojuegos;
  genreMap = genreMap;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
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
        next: (id: string) => this.getVideogameDetail(id),
        error: (err) => console.error(err),
      });
  }

  getVideogameDetail(id: string) {
    this.searchService.searchVideogameDetail(id).subscribe({
      next: (videogame: Videojuegos) => {
        this.videogame = videogame;
      },
    });
  }
}
