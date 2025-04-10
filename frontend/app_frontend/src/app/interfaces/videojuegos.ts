import { Genero } from './genero.enum';

export interface Videojuegos {
  id: string;
  titulo: string;
  resumen: string;
  imagen: string;
  desarrolladora: string;
  genero: Genero;
  anoLanzamiento: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface CustomList {
  id: string;
  nombre: string;
  idUsuario: string;
}

export interface WishList {
  id: string;
  videojuego: Videojuegos;
  isPlayedList: boolean;
}

export interface Rating {
  id: string;
  videojuego: Videojuegos;
  comentario: string;
  estrellas: number;
  usuario: User;
}
