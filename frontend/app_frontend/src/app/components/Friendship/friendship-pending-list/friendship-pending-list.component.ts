import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Friendship } from '../../../interfaces/videojuegos';
import { Estado } from '../../../interfaces/genero.enum';
import { UpdateService } from '../../../services/update.service';

@Component({
  selector: 'app-friendship-pending-list',
  imports: [MatIcon],
  templateUrl: './friendship-pending-list.component.html',
  styleUrl: './friendship-pending-list.component.scss',
})
export class FriendshipPendingListComponent {
  @Input()
  pendingFriendship: Friendship[] = [];

  @Output()
  isFriends: EventEmitter<Estado> = new EventEmitter<Estado>();
  @Input()
  idUsuario: string | null;
  constructor(private updateService: UpdateService) {}

  updateFriendRequest(friend: Friendship, estado: Estado) {
    let idFriend: string = '';
    if (friend.usuario1.id != this.idUsuario) {
      idFriend = friend.usuario1.id;
    } else if (friend.usuario2.id != this.idUsuario) {
      idFriend = friend.usuario2.id;
    }
    this.updateService.addFriendRequest(idFriend, estado).subscribe({
      next: (result: Estado) => {
        this.isFriends.emit(result);
      },
    });
  }
}
