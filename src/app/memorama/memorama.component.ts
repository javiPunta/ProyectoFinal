import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Food } from "./game-engine/food";
import { Snake } from "./game-engine/snake";
import { outsideGrid } from "./game-engine/gameboard-grid.util";
import { ServicioService } from '../servicio.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-memorama',
  templateUrl: './memorama.component.html',
  styleUrls: ['./memorama.component.scss']
})
export class MemoramaComponent implements OnInit, AfterViewInit {
  title = 'snake';
  gameBoard: any;
  snake = new Snake();
  food = new Food(this.snake);
  lastRenderTime = 0;
  gameOver = false;
  session: string = '';
  mostrarMenuUsuario: boolean = false;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private servicio: ServicioService
  ) {}

  ngAfterViewInit() {
    this.gameBoard = document.querySelector('.game-board');
    window.requestAnimationFrame(this.start.bind(this));
  }

  ngOnInit(): void {
    this.snake.listenToInputs();
    const sessionCookieExists = this.cookieService.check('session');
    if (sessionCookieExists) {
      this.session = this.cookieService.get('session');
    }
  }

  dpadMovement(direction: string) {
    this.snake.input.setDirection(direction);
  }

  start(currentTime: any) {
    if (this.gameOver) {
      return console.log('Game Over');
    }

    window.requestAnimationFrame(this.start.bind(this));
    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.snakeSpeed) {
      return;
    }

    this.lastRenderTime = currentTime;
    this.update();
    this.draw();
  }

  update() {
    this.snake.update();
    this.food.update();
    this.checkDeath();
  }

  draw() {
    this.gameBoard.innerHTML = '';
    this.snake.draw(this.gameBoard);
    this.food.draw(this.gameBoard);
  }

  checkDeath() {
    const nombre_user = this.cookieService.get('session');
    const nuevo = {
      apodo: nombre_user,
      pnts: this.food.currentScore,
    };

    this.gameOver = outsideGrid(this.snake.getSnakeHead()) || this.snake.snakeIntersection();
    if (!this.gameOver) {
      return;
    }
    this.gameBoard.classList.add('blur');
    console.log(nuevo);
    this.servicio.almacenarPuntosJuegos(nuevo).subscribe((datos) => {
      console.log('Datos enviados al servidor:', datos);
    });
  }

  get snakeSpeed() {
    const score = this.food.currentScore;
    if (score < 10) {
      return 4;
    }
    if (score > 10 && score < 15) {
      return 5;
    }
    if (score > 15 && score < 20) {
      return 6;
    }
    return 7;
  }

  restartGame() {
    window.location.reload();
  }

  cerrarSesion() {
    this.cookieService.delete('session');
    this.session = '';
    this.mostrarMenuUsuario = false;
    this.router.navigate(['/']);
  }

  cambiarUsuario() {
    this.cookieService.delete('session');
    this.session = '';
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/principal']);
  }
}
