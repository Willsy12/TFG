import { Genero } from './genero.enum';

export interface VideojuegosFilter {
  añoLanzamiento: number;
  genero: Genero;
  desarrolladora: string;
  titulo: string;
}
