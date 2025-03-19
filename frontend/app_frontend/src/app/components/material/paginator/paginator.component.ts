import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent {
  @Input() totalPages: number = 10;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): (number | string)[] {
    const pagesToShow = 5;
    if (this.totalPages <= pagesToShow) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];
    if (this.currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (this.currentPage < this.totalPages - 2) {
      pages.push('...');
    }

    pages.push(this.totalPages);
    return pages;
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    console.log(this.currentPage, this.totalPages);
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
