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
