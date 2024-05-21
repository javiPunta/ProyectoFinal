import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServicioService } from '../servicio.service';
import { Ranking } from '../model/ranking';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private ranking: Ranking[] = [];

  constructor(private servicioService: ServicioService) {}

  updateScore(username: string, score: number): void {
    // Encuentra el jugador y actualiza su puntuación o lo agrega si es nuevo
    const playerIndex = this.ranking.findIndex(player => player.nombre_user === username);
    if (playerIndex > -1) {
      this.ranking[playerIndex].puntos_total = score;
    } else {
      const newRanking: Ranking = { id_ranking: 0, nombre_user: username, puntos_total: score, fecha_mensua: '' };
      this.ranking.push(newRanking);
    }
    // Ordena el ranking de mayor a menor puntuación
    this.ranking.sort((a, b) => b.puntos_total - a.puntos_total);
    
    // Actualizar en la base de datos
    this.updateScoreInDb(username, score).subscribe(
      response => console.log('Puntuación actualizada en la base de datos', response),
      error => console.error('Error al actualizar puntuación en la base de datos', error)
    );
  }

  getRanking(): Ranking[] {
    return this.ranking;
  }

  private updateScoreInDb(username: string, score: number): Observable<any> {
    const payload = { nombre_user: username, puntos_total: score, fecha_mensua: null };
    return this.servicioService.almacenarPuntos(payload);
  }

  getRankingFromDb(): Observable<Ranking[]> {
    return this.servicioService.mostrarUsers({}).pipe(
      map((users: any[]) => users.map(user => ({
        id_ranking: 0,
        nombre_user: user.username,
        puntos_total: user.score,
        fecha_mensua: ''
      })))
    );
  }
}
