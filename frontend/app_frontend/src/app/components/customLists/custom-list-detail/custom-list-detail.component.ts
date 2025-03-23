import { Component, OnInit } from '@angular/core';
import { CustomList, Videojuegos } from '../../../interfaces/videojuegos';
import { SearchService } from '../../../services/search.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of, switchMap, throwError } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-custom-list-detail',
  imports: [RouterModule, MatIcon],
  templateUrl: './custom-list-detail.component.html',
  styleUrl: './custom-list-detail.component.scss',
})
export class CustomListDetailComponent implements OnInit {
  customList: CustomList;
  videogames: Videojuegos[] = [];

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          return id ? of(id) : throwError(() => new Error('ID not found'));
        })
      )
      .subscribe({
        next: (id: string) => this.getCustomListDetail(id),
        error: (err) => console.error(err),
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
      },
    });
  }
}
