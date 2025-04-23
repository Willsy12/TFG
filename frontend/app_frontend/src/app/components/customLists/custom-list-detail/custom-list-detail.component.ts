import { Component, OnInit } from '@angular/core';
import { CustomList, Videojuegos } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of, switchMap, throwError } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { DialogComponent } from '../../material/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateService } from '../../../services/update.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TagComponent } from '../../material/tag/tag.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-list-detail',
  imports: [RouterModule, MatIcon, TagComponent, CommonModule, FormsModule],
  templateUrl: './custom-list-detail.component.html',
  styleUrl: './custom-list-detail.component.scss',
})
export class CustomListDetailComponent implements OnInit {
  customList: CustomList;
  videogames: Videojuegos[] = [];
  tagListVideogame: Videojuegos[] = [];
  isEditMode: boolean = false;
  showErrorMessage: boolean = false;

  constructor(
    private searchService: SearchService,
    private updateService: UpdateService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.isEditMode = segments.some((segment) => segment.path === 'edit');
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          return id ? of(id) : throwError(() => new Error('ID not found'));
        })
      )
      .subscribe({
        next: (id: string) => this.getCustomListDetail(id),
      });
  }

  getCustomListDetail(id: string) {
    this.searchService.searchCustomListDetails(id).subscribe({
      next: (customList: CustomList) => {
        this.customList = customList;
        this.getElementsList(this.customList.id);
      },
    });
  }

  getElementsList(id: string) {
    this.searchService.searchElementList(id).subscribe({
      next: (videogames: Videojuegos[]) => {
        this.videogames = videogames;
        this.tagListVideogame = videogames;
      },
    });
  }

  openDialogShowVideogames(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      data: {
        titulo: 'Buscador de videojuegos',
        method: 'searchVideogames',
      },
    });

    dialogRef.afterClosed().subscribe((result: Videojuegos) => {
      if (result != null) {
        if (!this.tagListVideogame.some((v) => v.titulo === result.titulo)) {
          this.tagListVideogame.push(result);
        }
      }
    });
  }
  deleteVideogameTag(titulo: string) {
    this.tagListVideogame = this.tagListVideogame.filter((v) => v.titulo != titulo);
  }

  updateCustomList() {
    if (this.tagListVideogame.length > 0 && this.customList.nombre.length > 1) {
      const oldVideogames = this.videogames.filter((v) => !this.tagListVideogame.includes(v));

      this.updateService.updateCustomList(this.customList.id, this.customList.nombre).subscribe({
        next: (result: boolean) => {
          if (result) {
            oldVideogames.forEach((v) => {
              this.updateService.deleteElementList(this.customList.id, v.id).subscribe({
                next: (result: boolean) => {},
              });
            });

            this.tagListVideogame.forEach((v) => {
              this.updateService.updateElementList(this.customList.id, v.id).subscribe({
                next: (result: boolean) => {
                  if (result) {
                    this.openSnackBar('Lista actualizada');
                    this.showErrorMessage = false;
                    this.router.navigate(['Mis-Listas']);
                  } else {
                    this.openSnackBar('Ocurrio un error al actualizar la lista');
                    this.router.navigate(['Mis-Listas']);
                  }
                },
              });
            });
          } else {
            this.openSnackBar('Ocurrio un error al actualizar la lista');
            this.router.navigate(['Mis-Listas']);
          }
        },
      });
    } else {
      this.showErrorMessage = true;
    }
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }
  disableAddMode() {
    this.router.navigate(['Mis-Listas']);
  }
}
