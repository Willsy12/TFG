import { HttpClient, HttpContextToken, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VideojuegosFilter } from '../interfaces/videojuegos-filter';
import { Videojuegos } from '../interfaces/videojuegos';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly BASE_URL = 'http://127.0.0.1:8000/api/v1/';

  constructor(private http: HttpClient) {}

  searchVideogames(): Observable<Videojuegos[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Token ${localStorage.getItem('token')}`
    );

    return this.http
      .get<Videojuegos[]>(`${this.BASE_URL}videojuegos/`, { headers })
      .pipe(map((response) => this.MapResponseToVideogame(response)));
  }

  searchVideogamesWithFilters(filterVideogame: VideojuegosFilter) {
    let params = new HttpParams();

    if (filterVideogame.desarrolladora) {
      params = params.set('desarrolladora', filterVideogame.desarrolladora);
    }

    if (filterVideogame.titulo) {
      params = params.set('título', filterVideogame.titulo);
    }

    if (filterVideogame.genero) {
      params = params.set('genero', filterVideogame.genero);
    }

    if (filterVideogame.añoLanzamiento) {
      params = params.set('añoLanzamiento', filterVideogame.añoLanzamiento);
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Token ${localStorage.getItem('token')}`
    );

    return this.http
      .get<Videojuegos[]>(`${this.BASE_URL}videojuegos/`, { params, headers })
      .pipe(map((response) => this.MapResponseToVideogame(response)));
  }

  private MapResponseToVideogame(response: any): Videojuegos[] {
    return response.map((videogame: any) => ({
      id: videogame.id,
      titulo: videogame.título,
      resumen: videogame.resumen,
      imagen: videogame.imagen,
      desarrolladora: videogame.desarrolladora,
      genero: videogame.genero,
      anoLanzamiento: videogame.añoLanzamiento,
    }));
  }

  searchVideogameDetail(id: string): Observable<Videojuegos> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Token ${localStorage.getItem('token')}`
    );

    return this.http.get(`${this.BASE_URL}videojuegos/${id}/`, { headers }).pipe(
      map((response: any) => ({
        id: response.id,
        resumen: response.resumen,
        imagen: response.imagen,
        genero: response.genero,
        titulo: response.título,
        desarrolladora: response.desarrolladora,
        anoLanzamiento: response.añoLanzamiento,
      }))
    );
  }
}
