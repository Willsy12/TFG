import { Component, OnInit } from '@angular/core';
import { CustomListListsComponent } from '../custom-list-lists/custom-list-lists.component';
import { MatIcon } from '@angular/material/icon';
import { CustomList, Videojuegos } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { UpdateService } from '../../../services/update.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../material/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { TagComponent } from '../../material/tag/tag.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-list-layout',
  imports: [CustomListListsComponent, MatIcon, TagComponent, FormsModule, MatProgressSpinnerModule],
  templateUrl: './custom-list-layout.component.html',
  styleUrl: './custom-list-layout.component.scss',
})
export class CustomListLayoutComponent implements OnInit {
  customLists: CustomList[] = [];
  addList: boolean = false;
  tagListVideogame: Videojuegos[] = [];
  listName: string = '';
  showErrorMessage: boolean = false;
  loading: boolean = true;

  constructor(
    private updateService: UpdateService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCustomLists(); // Carga las listas al inicializar el componente
  }

  loadCustomLists(): void {
    this.loading = true;
    this.searchService.seachCustomList().subscribe({
      next: (customList: CustomList[]) => {
        this.customLists = customList;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar las listas personalizadas:');
      },
    });
  }

  updateCustomLists(customList: CustomList): void {
    this.updateService.deleteCustomList(customList.id).subscribe({
      next: (result) => {
        if (result) {
          this.loadCustomLists();
        }
      },
      error: (err) => {
        console.error('Error al eliminar la lista personalizada:');
      },
    });
  }

  enableAddMode(): void {
    this.addList = true;
  }

  disableAddMode(): void {
    this.addList = false;
    this.tagListVideogame = [];
    this.listName = '';
  }

  addCustomList(): void {
    if (this.tagListVideogame.length < 1 || this.listName == '') {
      this.showErrorMessage = true;
    } else {
      this.updateService.addCustomList(this.listName).subscribe({
        next: (customList: CustomList) => {
          this.addElementsList(customList.id);
        },
      });
    }
  }

  addElementsList(id: string) {
    this.tagListVideogame.forEach((v) => {
      this.updateService.addElementList(id, v.id).subscribe({
        next: (res: boolean) => {
          this.disableAddMode();
          this.openSnackBar('Lista creada');
          this.loadCustomLists();
        },
      });
    });
  }

  openDialog(customList: CustomList): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '650px',
      data: {
        message: `¿Estás seguro de eliminar la lista '${customList.nombre}'?`,
        method: 'deleteCustomList',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openSnackBar('Lista borrada');
        this.updateCustomLists(customList);
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
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
}
