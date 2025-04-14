import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { User, Videojuegos } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VideojuegosFilter } from '../../../interfaces/videojuegos-filter';
import { VideogameFilterComponent } from '../../Videogame/videogame-filter/videogame-filter.component';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { UpdateService } from '../../../services/update.service';
import { Estado } from '../../../interfaces/genero.enum';

@Component({
  selector: 'app-dialog',
  imports: [
    MatIcon,
    PaginatorComponent,
    CommonModule,
    ReactiveFormsModule,
    VideogameFilterComponent,
    RatingModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  videogames: Videojuegos[] = [];
  pagedVideogames: Videojuegos[][] = [];
  totalVideogames: Videojuegos[] = [];
  filterVideogameForm: FormGroup;
  value!: number;
  comment: string = '';
  userName: string | null;
  showErrorMessage: boolean = false;
  totalPages: number = 0;
  maxNumberVideogames: number = 3;
  currentPage: number = 0;
  userList: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private searchService: SearchService,
    private authService: AuthService,
    private updateService: UpdateService,
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

  rate() {
    const videogame = this.data.videogame;
    if (this.value != undefined) {
      this.updateService.addVideogameRate(videogame.id, this.comment, this.value).subscribe({
        next: (result: boolean) => {
          this.dialogRef.close(result);
        },
      });
    } else {
      this.showErrorMessage = true;
    }
  }

  searchUser() {
    this.searchService.searchUsers(this.userName).subscribe({
      next: (result: User[]) => {
        this.userList = result.filter((u) => u.id != localStorage.getItem('userId'));
      },
    });
  }

  sendFriendRequest(id: string) {
    this.updateService.addFriendRequest(id, null).subscribe({
      next: (result: Estado) => {
        this.dialogRef.close(result);
      },
    });
  }
}
