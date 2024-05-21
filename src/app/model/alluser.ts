export interface Generado {
  nombre_user: string;
  nombre_compl_user?: string; // Cambiado a opcional para ser consistente
  contrasenia: string;
  email: string;
  nombre_tienda?: string;
  telefono?: string;
  num_ticket?: number;
  puntos_juego?: number;
  puntos_encuesta?: number;
}
