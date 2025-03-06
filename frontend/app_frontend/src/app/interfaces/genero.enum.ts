export enum Genero {
  ACCION = 'ACC',
  AVENTURA = 'AVT',
  ARCADE = 'ARC',
  DEPORTE = 'DTP',
  ESTRATEGIA = 'EST',
  SIMULACION = 'SIM',
  MESA = 'MES',
  MUSICALES = 'MUS',
}

export const genreMap = {
  [Genero.ACCION]: 'Accion',
  [Genero.ARCADE]: 'Arcade',
  [Genero.AVENTURA]: 'Aventura',
  [Genero.DEPORTE]: 'Deporte',
  [Genero.ESTRATEGIA]: 'Estrategia',
  [Genero.SIMULACION]: 'Simulacion',
  [Genero.MESA]: 'Juegos de mesa',
  [Genero.MUSICALES]: 'Musicales',
};
