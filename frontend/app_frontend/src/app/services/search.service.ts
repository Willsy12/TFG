import { HttpClient, HttpContextToken, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VideojuegosFilter } from '../interfaces/videojuegos-filter';
import {
  CustomList,
  Friendship,
  Rating,
  User,
  Videojuegos,
  WishList,
} from '../interfaces/videojuegos';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly BASE_URL = 'http://127.0.0.1:8000/api/v1/';
  private readonly HEADERS = new HttpHeaders().set(
    'Authorization',
    `Token ${localStorage.getItem('token')}`
  );
  constructor(private http: HttpClient) {}

  searchVideogames(): Observable<Videojuegos[]> {
    return this.http
      .get<Videojuegos[]>(`${this.BASE_URL}videojuegos/`, { headers: this.HEADERS })
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

    return this.http
      .get<Videojuegos[]>(`${this.BASE_URL}videojuegos/`, { params, headers: this.HEADERS })
      .pipe(map((response) => this.MapResponseToVideogame(response)));
  }

  searchVideogameDetail(id: string): Observable<Videojuegos> {
    return this.http.get(`${this.BASE_URL}videojuegos/${id}/`, { headers: this.HEADERS }).pipe(
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

  seachCustomList(): Observable<CustomList[]> {
    return this.http
      .get(`${this.BASE_URL}myLists/`, { headers: this.HEADERS })
      .pipe(map((response) => this.MapResponseToCustomList(response)));
  }

  searchCustomListDetails(id: string): Observable<CustomList> {
    return this.http.get(`${this.BASE_URL}myLists/${id}/`, { headers: this.HEADERS }).pipe(
      map((response: any) => ({
        id: response.id,
        idUsuario: response.idUsuario,
        nombre: response.nombre,
      }))
    );
  }

  searchElementList(id: string): Observable<Videojuegos[]> {
    return this.http
      .get<
        { idVideojuego: any }[]
      >(`${this.BASE_URL}myLists/${id}/elements/`, { headers: this.HEADERS })
      .pipe(
        map((response) => response.map((item) => this.mapResponseToVideogame(item.idVideojuego)))
      );
  }

  searchVideogameInWishList(): Observable<WishList[]> {
    return this.http
      .get<WishList[]>(`${this.BASE_URL}wishList/`, { headers: this.HEADERS })
      .pipe(map((response) => this.MapResponseToWishList(response)));
  }

  searchVideogameInPlayedList(): Observable<WishList[]> {
    return this.http
      .get<WishList[]>(`${this.BASE_URL}playedList/`, { headers: this.HEADERS })
      .pipe(map((response) => this.MapResponseToWishList(response)));
  }

  searchVideogameInList(): Observable<WishList[]> {
    return this.http
      .get<WishList[]>(`${this.BASE_URL}allWishList/`, { headers: this.HEADERS })
      .pipe(map((response) => this.MapResponseToWishList(response)));
  }

  checkVideogameIsWishList(id: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(`${this.BASE_URL}wishList/${id}/`, { headers: this.HEADERS })
      .pipe(
        map((response) => {
          return response.exists;
        })
      );
  }

  checkVideogameIsPlayedList(id: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(`${this.BASE_URL}playedList/${id}/`, { headers: this.HEADERS })
      .pipe(map((response) => response.exists));
  }

  searchVideogameRating(id: string): Observable<Rating[]> {
    return this.http
      .get<Rating[]>(`${this.BASE_URL}ratings/${id}/`, { headers: this.HEADERS })
      .pipe(map((response) => this.MapResponseToRating(response)));
  }

  searchAllVideogameRating(): Observable<Rating[]> {
    return this.http
      .get<Rating[]>(`${this.BASE_URL}allRatings/`, { headers: this.HEADERS })
      .pipe(map((response) => this.MapResponseToRating(response)));
  }

  searchFriendShips(): Observable<Friendship[]> {
    return this.http
      .get<Friendship[]>(`${this.BASE_URL}friendships/`, { headers: this.HEADERS })
      .pipe(map((response) => this.MapResponseToFriendship(response)));
  }

  searchUsers(username: string | null): Observable<User[]> {
    let params = new HttpParams();
    if (username) {
      params = params.set('username', username);
      return this.http
        .get<User[]>(`${this.BASE_URL}allUsers/`, { headers: this.HEADERS, params })
        .pipe(
          map((response: User[]) => response.map((user: User) => this.mapResponseToUser(user)))
        );
    } else {
      return of([]);
    }
  }

  private MapResponseToFriendship(response: any): Friendship[] {
    return response.map((friendship: any) => ({
      id: friendship.id,
      usuario1: this.mapResponseToUser(friendship.idUsuario1),
      usuario2: this.mapResponseToUser(friendship.idUsuario2),
      estado: friendship.estado,
    }));
  }

  private MapResponseToRating(response: any): Rating[] {
    return response.map((rating: any) => ({
      id: rating.id,
      videojuego: this.mapResponseToVideogame(rating.idVideojuego),
      comentario: rating.comentario,
      estrellas: rating.estrellas,
      usuario: this.mapResponseToUser(rating.idUsuario),
    }));
  }

  private mapResponseToUser(user: any): User {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  private MapResponseToWishList(data: any): WishList[] {
    return data.map((wishList: any) => ({
      id: wishList.id,
      videojuego: this.mapResponseToVideogame(wishList.idVideojuego),
      isPlayedList: wishList.isPlayedList,
      idUsuario: this.mapResponseToUser(wishList.idUsuario),
    }));
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

  private mapResponseToVideogame(data: any): Videojuegos {
    return {
      id: data.id,
      titulo: data.título,
      resumen: data.resumen,
      imagen: data.imagen,
      desarrolladora: data.desarrolladora,
      genero: data.genero,
      anoLanzamiento: data.añoLanzamiento,
    };
  }

  private MapResponseToCustomList(response: any): CustomList[] {
    return response.map((customList: any) => {
      return {
        id: customList.id,
        idUsuario: customList.idUsuario,
        nombre: customList.nombre,
      };
    });
  }
}
