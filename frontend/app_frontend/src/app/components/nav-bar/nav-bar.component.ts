import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DialogComponent } from '../material/dialog/dialog.component';

@Component({
  selector: 'app-nav-bar',
  imports: [MatIconModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  constructor(private dialog: MatDialog) {}

  logout() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '650px',
      data: {
        message: '¿Seguro que quieres cerrar sesión?',
        method: 'logout',
      },
    });
  }
}
