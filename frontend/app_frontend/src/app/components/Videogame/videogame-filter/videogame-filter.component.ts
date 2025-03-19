import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VideojuegosFilter } from '../../../interfaces/videojuegos-filter';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatNumber } from '@angular/common';
import { Genero } from '../../../interfaces/genero.enum';

@Component({
  selector: 'app-videogame-filter',
  imports: [MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './videogame-filter.component.html',
  styleUrl: './videogame-filter.component.scss',
})
export class VideogameFilterComponent implements OnInit {
  genreMap = {
    [Genero.ACCION]: 'Accion',
    [Genero.ARCADE]: 'Arcade',
    [Genero.AVENTURA]: 'Aventura',
    [Genero.DEPORTE]: 'Deporte',
    [Genero.ESTRATEGIA]: 'Estrategia',
    [Genero.SIMULACION]: 'Simulacion',
    [Genero.MESA]: 'Juegos de mesa',
    [Genero.MUSICALES]: 'Musicales',
  };

  isCollapsed: boolean = false;
  filterVideogameForm: FormGroup;
  genres = Object.values(Genero);

  @Output()
  filterVideogameEvent: EventEmitter<VideojuegosFilter> = new EventEmitter<VideojuegosFilter>();

  @Output()
  clearVideogames: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.isCollapsed = false;
    this.filterVideogameForm = new FormGroup({
      genero: new FormControl(''),
      desarrolladora: new FormControl(''),
      añoLanzamiento: new FormControl(''),
      titulo: new FormControl(''),
    });
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  onSubmit() {
    this.filterVideogameEvent.emit(this.filterVideogameForm.value);
  }

  clearFilters() {
    this.filterVideogameForm.reset({
      genero: '',
      desarrolladora: '',
      añoLanzamiento: '',
      titulo: '',
    });
    console.log(this.filterVideogameForm.value);
    this.clearVideogames.emit();
  }
}
