import { Component, OnInit } from '@angular/core';
import { FriendshipPendingListComponent } from '../friendship-pending-list/friendship-pending-list.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Friendship } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { Estado } from '../../../interfaces/genero.enum';
import { filter } from 'rxjs';
import { UpdateService } from '../../../services/update.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../material/dialog/dialog.component';

@Component({
  selector: 'app-friendship-list',
  imports: [FriendshipPendingListComponent, CommonModule, MatIcon],
  templateUrl: './friendship-list.component.html',
  styleUrl: './friendship-list.component.scss',
})
export class FriendshipListComponent implements OnInit {
  showPendingRequest: boolean = false;
  friendships: Friendship[] = [];
  idUsuario: string | null = localStorage.getItem('userId');
  pendingFriends: Friendship[] = [];

  constructor(
    private searchService: SearchService,
    private updateService: UpdateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends() {
    this.searchService.searchFriendShips().subscribe({
      next: (result: Friendship[]) => {
        this.friendships = result.filter((f) => f.estado == Estado.ACEPTADO);
        this.pendingFriends = result.filter((f) => f.estado == Estado.PENDIENTE);
      },
    });
  }

  updateFriends(estado: Estado) {
    if (estado === Estado.ACEPTADO) {
      this.openSnackBar('Solicitud aceptada');
    } else if (estado === Estado.RECHAZADO) {
      this.openSnackBar('Solicitud rechazada');
    }

    this.loadFriends();
  }

  changeFunction(value: boolean) {
    this.showPendingRequest = value;
  }

  addFriend() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '650px',

      data: {
        user: this.idUsuario,
        method: 'addFriend',
      },
    });

    dialogRef.afterClosed().subscribe((result: Estado) => {
      if (result === Estado.PENDIENTE) {
        this.openSnackBar('Solicitud de amistad enviada');
      } else {
        this.openSnackBar(
          'No se puedo enviar la solicitud.Asegurate de que el usuario no esta agregado o existe'
        );
      }
    });
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
