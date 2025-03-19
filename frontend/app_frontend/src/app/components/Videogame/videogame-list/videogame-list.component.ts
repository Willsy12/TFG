import { Component, Input } from '@angular/core';
import { Videojuegos } from '../../../interfaces/videojuegos';
import { Genero } from '../../../interfaces/genero.enum';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-videogame-list',
  imports: [RouterModule],
  templateUrl: './videogame-list.component.html',
  styleUrl: './videogame-list.component.scss',
})
export class VideogameListComponent {
  @Input()
  videogames: Videojuegos[] = [];

  constructor() {}
}
