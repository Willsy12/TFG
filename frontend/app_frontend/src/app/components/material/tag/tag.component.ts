import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tag',
  imports: [MatIcon],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class TagComponent {
  @Input()
  valor: string;

  @Output()
  deleteEvent = new EventEmitter<string>();

  constructor() {}

  deleteTag() {
    this.deleteEvent.emit(this.valor);
  }
}
