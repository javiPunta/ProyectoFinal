import { Component, OnInit } from '@angular/core';
import { RankingService } from './ranking.service';
import { Ranking } from '../model/ranking';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  players: Ranking[] = []; // Inicializa el arreglo para almacenar los jugadores

  constructor(private rankingService: RankingService, private router: Router) {}

  ngOnInit(): void {
    this.getPlayers();
  }

  getPlayers(): void {
    this.rankingService.getRankingFromDb().subscribe(
      (response: Ranking[]) => {
        this.players = response;
        // Ordena los jugadores por puntos de mayor a menor
        this.players.sort((a, b) => b.puntos_total - a.puntos_total);
        console.log('Jugadores recibidos:', this.players);
      },
      (error) => {
        console.error('Error al obtener jugadores:', error);
      }
    );
  }

  goHome() {
    this.router.navigate(['/principal']);
  }
}
