import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { CustomList } from '../interfaces/videojuegos';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly BASE_URL = 'http://127.0.0.1:8000/api/v1/';
  private readonly HEADERS = new HttpHeaders().set(
    'Authorization',
    `Token ${localStorage.getItem('token')}`
  );
  constructor(private http: HttpClient) {}

  deleteCustomList(id: string): Observable<boolean> {
    return this.http
      .delete(`${this.BASE_URL}myLists/${id}/`, { headers: this.HEADERS })
      .pipe(map(() => true));
  }

  addCustomList(nombre: string): Observable<CustomList> {
    const request = { nombre: nombre };
    return this.http
      .post<CustomList>(`${this.BASE_URL}myLists/`, request, { headers: this.HEADERS })
      .pipe(map((response: CustomList) => response));
  }

  addElementList(id: string, idVideogame: string): Observable<boolean> {
    const request = { idVideojuego: idVideogame };
    return this.http
      .post(`${this.BASE_URL}myLists/${id}/elements/`, request, { headers: this.HEADERS })
      .pipe(
        map(() => true),
        catchError(() => {
          return of(false);
        })
      );
  }

  addVideogameInWishList(idVideojuego: string): Observable<boolean> {
    const request = { idVideojuego: idVideojuego };
    return this.http
      .post(`${this.BASE_URL}wishList/`, request, { headers: this.HEADERS })
      .pipe(map(() => true));
  }

  addVideogameInPlayedList(idVideojuego: string): Observable<boolean> {
    const request = { idVideojuego: idVideojuego };
    return this.http
      .post(`${this.BASE_URL}playedList/`, request, { headers: this.HEADERS })
      .pipe(map(() => true));
  }

  deleteVideogameInWishList(idVideojuego: string): Observable<boolean> {
    return this.http
      .delete(`${this.BASE_URL}wishList/${idVideojuego}/`, { headers: this.HEADERS })
      .pipe(map(() => true));
  }

  deleteVideogameInPlayedList(idVideojuego: string): Observable<boolean> {
    return this.http
      .delete(`${this.BASE_URL}playedList/${idVideojuego}/`, { headers: this.HEADERS })
      .pipe(map(() => true));
  }

  addVideogameRate(idVideojuego: string, comentario: string, estrellas: number) {
    const request = { idVideojuego: idVideojuego, comentario: comentario, estrellas: estrellas };

    return this.http
      .post(`${this.BASE_URL}ratings/`, request, { headers: this.HEADERS })
      .pipe(map(() => true));
  }
}
