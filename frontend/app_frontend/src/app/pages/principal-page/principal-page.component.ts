import { Component, OnInit } from '@angular/core';
import { Videojuegos } from '../../interfaces/videojuegos';
import { SearchService } from '../../services/search.service';
import { Router, RouterModule } from '@angular/router';
import { VideojuegosFilter } from '../../interfaces/videojuegos-filter';
import { Genero } from '../../interfaces/genero.enum';
import { HeaderComponent } from '../../components/header/header.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-principal-page',
  imports: [HeaderComponent, NavBarComponent, RouterModule],
  templateUrl: './principal-page.component.html',
  styleUrl: './principal-page.component.scss',
})
export class PrincipalPageComponent implements OnInit {
  videojuegos: Videojuegos[] = [];

  constructor() {}

  ngOnInit(): void {}
}
