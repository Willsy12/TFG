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
