import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomList } from '../../../interfaces/videojuegos';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom-list-lists',
  imports: [MatIcon, MatMenuModule, RouterModule],
  templateUrl: './custom-list-lists.component.html',
  styleUrl: './custom-list-lists.component.scss',
})
export class CustomListListsComponent implements OnInit {
  @Input()
  customList: CustomList;

  @Output()
  deleteList: EventEmitter<CustomList> = new EventEmitter<CustomList>();

  constructor() {}

  ngOnInit(): void {}

  deleteListEvent() {
    this.deleteList.emit(this.customList);
  }
}
