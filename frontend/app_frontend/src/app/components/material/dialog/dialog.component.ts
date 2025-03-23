import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Videojuegos } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VideojuegosFilter } from '../../../interfaces/videojuegos-filter';
import { VideogameFilterComponent } from '../../Videogame/videogame-filter/videogame-filter.component';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dialog',
  imports: [
    MatIcon,
    PaginatorComponent,
    CommonModule,
    ReactiveFormsModule,
    VideogameFilterComponent,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  videogames: Videojuegos[] = [];
  pagedVideogames: Videojuegos[][] = [];
  totalVideogames: Videojuegos[] = [];
  filterVideogameForm: FormGroup;

  totalPages: number = 0;
  maxNumberVideogames: number = 3;
  currentPage: number = 0;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchVideogameItems();
    this.filterVideogameForm = new FormGroup({
      titulo: new FormControl(''),
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
  searchVideogameItems() {
    this.searchService.searchVideogames().subscribe({
      next: (result: Videojuegos[]) => {
        this.paginateVidegames(result);
        this.videogames = this.pagedVideogames.at(this.currentPage) ?? [];
        this.totalPages = Math.ceil(result.length / this.maxNumberVideogames);
      },
    });
  }
  closeDialog() {
    this.dialogRef.close(false);
  }

  executeAction() {
    this.dialogRef.close(true);
  }

  addVideogameTag(videogame: Videojuegos) {
    this.dialogRef.close(videogame);
  }

  clearFilters(any: any) {
    this.searchVideogameItems();
  }

  searchFilterVideogame(filterVideogameForm: VideojuegosFilter) {
    this.searchService.searchVideogamesWithFilters(filterVideogameForm).subscribe({
      next: (result: Videojuegos[]) => (this.videogames = result),
    });
    this.totalPages = Math.ceil(this.videogames.length / this.maxNumberVideogames);
  }

  logout() {
    this.authService.logout().subscribe({
      next: (result: boolean) => {
        if (result) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          this.closeDialog();
          this.router.navigate(['/Login']);
        }
      },
    });
  }
}
