import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from './model/usuario';
import { Tienda } from './model/tienda';
import { Encuesta } from './model/encuesta';
import { Tabla } from './model/tabla';
import { TiendaUser } from './model/tienda_user';
@Injectable({
  providedIn: 'root' // Este servicio se proporciona en la raíz de la aplicación
})
export class ServicioService {
  private readonly url: string = 'http://localhost/server/'; // URL base para las peticiones HTTP

  constructor(private http: HttpClient) { }

  // Métodos para USUARIOS

  /**
   * Obtiene los datos de todos los usuarios.
   * @returns Observable<Usuario[]>
   */
  getDatosUsuario(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}form_user/buscar_user.php`);
  }

  /**
   * Obtiene los datos de los usuarios a través de su correo electrónico.
   * @returns Observable<Tabla[]>
   */
  getDatosUsuarioCorreo(): Observable<Tabla[]> {
    return this.http.get<Tabla[]>(`${this.url}form_user/buscar_user_email.php`);
  }

  /**
   * Registra un nuevo usuario.
   * @param usuario - Datos del usuario a registrar.
   * @returns Observable<any>
   */
  getDatosRegistro(usuario: Usuario): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_user/registro.php`, usuario, { headers });
  }

  /**
   * Borra un usuario existente.
   * @param usuario - Datos del usuario a borrar.
   * @returns Observable<any>
   */
  borrarUsuario(usuario: Usuario | Tabla): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_user/borrar_user.php`, usuario, { headers });
  }

  /**
   * Modifica los datos de un usuario.
   * @param usuario - Datos del usuario a modificar.
   * @returns Observable<any>
   */
  modificarUsuario(usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_user/modificar_user.php`, usuario, { headers });
  }

  /**
   * Modifica todos los datos de un usuario.
   * @param usuario - Datos completos del usuario a modificar.
   * @returns Observable<any>
   */
  modificarUsuarioAll(usuario: Tabla): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.url}form_user/modificar_user_email.php`, usuario, { headers });
  }

  /**
   * Inicia sesión con los datos de un usuario.
   * @param usuario - Datos del usuario para iniciar sesión.
   * @returns Observable<any>
   */
  login(usuario: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_user/login.php`, usuario, { headers });
  }

  /**
   * Agrega un nuevo usuario.
   * @param usuario - Datos del usuario a agregar.
   * @returns Observable<any>
   */
  agregarUsuario(usuario: Tabla): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_user/add_user.php`, usuario, { headers });
  }
 
  // Métodos para TIENDAS

  /**
   * Obtiene los datos de todas las tiendas.
   * @returns Observable<Tienda[]>
   */
  getDatosTienda(): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(`${this.url}form_tienda/buscar_tienda.php`);
  }

  /**
   * Registra una nueva tienda.
   * @param tienda - Datos de la tienda a registrar.
   * @returns Observable<any>
   */
  getDatosRegistroTienda(tienda: Tienda): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_tienda/registro.php`, tienda, { headers });
  }
  getDatosRegistroTiendaConUser(tienda: TiendaUser): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_tienda/registro_us_tien.php`, tienda, { headers });
}
  /**
   * Borra una tienda existente.
   * @param tienda - Datos de la tienda a borrar.
   * @returns Observable<any>
   */
  borrarTienda(tienda: Tienda): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_tienda/borrar_tienda.php`, tienda, { headers });
  }

  /**
   * Modifica los datos de una tienda.
   * @param tienda - Datos de la tienda a modificar.
   * @returns Observable<any>
   */
  modificarTienda(tienda: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_tienda/modificar_tienda.php`, tienda, { headers });
  }
  getTiendaPorUsuario(TiendaUser: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_user/buscar_user_tienda.php`, { nombre_user: TiendaUser }, { headers });
  }
  
  // Métodos para TICKETS

  /**
   * Guarda una factura simplificada.
   * @param tickets - Datos de la factura a guardar.
   * @returns Observable<any>
   */
  guardarFacturaSimplificada(tickets: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_tienda/guardar_factura.php`, tickets, { headers });
  }
  verificarTicket(tickets: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}form_encuesta/verificar_ticket.php`, tickets, { headers });
  }
  // Métodos para RANKING

  /**
   * Almacena puntos para un usuario.
   * @param nuevo - Datos de los puntos a almacenar.
   * @returns Observable<any>
   */
  almacenarPuntos(nuevo: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}puntos/insertar_puntos_user.php`, nuevo, { headers });
  }

  /**
   * Almacena puntos de juegos para un usuario.
   * @param nuevo - Datos de los puntos de juegos a almacenar.
   * @returns Observable<any>
   */
  almacenarPuntosJuegos(nuevo: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}puntos/insert_pnts_juegos.php`, nuevo, { headers });
  }

  /**
   * Muestra los usuarios en el ranking.
   * @param mostrar - Datos de los usuarios a mostrar en el ranking.
   * @returns Observable<any>
   */
  mostrarUsers(mostrar: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.url}puntos/almacen_user_rank.php`, mostrar, { headers });
  }

  // Métodos para ENCUESTA

  /**
   * Obtiene los datos de todas las encuestas.
   * @returns Observable<Encuesta[]>
   */
  getDatosEncuesta(): Observable<Encuesta[]> {
    return this.http.get<Encuesta[]>(`${this.url}form_encuesta/buscar_encuesta.php`);
  }
  
  /**
   * Envía las respuestas de una encuesta.
   * @param nuevo - Datos de las respuestas a enviar.
   * @returns Observable<Encuesta>
   */
  enviarRespuestasEncuesta(nuevo: Encuesta): Observable<Encuesta> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Encuesta>(`${this.url}form_encuesta/enviar_encuesta.php`, nuevo, { headers });
  }
}