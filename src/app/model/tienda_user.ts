export interface TiendaUser {
    id_tienda?: number; // Omitido si es generado automáticamente por la base de datos
    nombre_user?: string; // Agrega la propiedad nombre_user si no está presente
    nombre_tienda: string;
    telefono: string;

}