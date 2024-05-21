/* Importes de archivos. */
import { randomGridPosition } from '../game-engine/gameboard-grid.util';

/* Clase que representa la comida en el juego.*/
export class Food {

  EXPANSION_RATE = 1; // La serpiente se alargará en 1 segmento cada vez que coma.
  score: number = 0;; // Puntuación
  food: any; // Posición actual de la comida en el tablero 
  snake; // Se utiliza para saber dónde está la serpiente y cómo se relaciona con la comida, como verificar si la serpiente ha comido la comida.

  /* Constructor de la clase Food que recibe la serpiente como argumento. */
  constructor(snake: any) {
    this.snake = snake; // Asigna la referencia de la serpiente a la propiedad snake.
    this.food = this.getRandomFoodPosition(); // Llama a getRandomFoodPosition() para inicializar la posición de la comida de manera aleatoria.
  }

  /* Método que actualiza la comida y verifica si la serpiente la ha comido. */
  update() {
    if (this.snake.onSnake(this.food)) { // Si la serpiente colisiona, 
      this.snake.expandSnake(this.EXPANSION_RATE); // se expande en la tasa definida por EXPANSION_RATE.
      this.food = this.getRandomFoodPosition(); // la comida se mueve a una nueva posición aleatoria e
      this.addScore = 1; // incrementa la puntuación del jugador en 1.
    }
     // Aquí asumiendo que tienes el nombre de usuario disponible
    //  this.rankingService.updateScore(this.username, this.food.currentScore);
    //  this.checkDeath();
  }

  /* Método que dibuja la comida en el tablero. */
  draw(gameBoard: any) {
    const foodElement = document.createElement('div'); // Crea un div que representa la comida y lo agrega al tablero.
    /* Establece la fil y columna en la que se ubicará la comida en el tablero. */
    foodElement.style.gridRowStart = this.food.y; 
    foodElement.style.gridColumnStart = this.food.x;
    foodElement.classList.add('food');  // Agrega una clase al elemento para aplicar...
    /*...los siguientes estilos especificos: */
    foodElement.style.borderRadius = '50%'; // Borde, para que la comida sea redonda
    foodElement.style.backgroundColor = '#FE0000'; //Fondo de la comida
    foodElement.style.transition = 'all .3ms ease-in'; // Transición suave a cualquier cambio en la comida.
    foodElement.style.border = '0.25vmin solid black'; // Borde alrededor del elemento para resaltar la comida.
   
    gameBoard.appendChild(foodElement); // Agrega el elemento de comida al tablero de juego.
  }

  /* Método que genera una nueva posición aleatoria para la comida. */
  getRandomFoodPosition() {
    let newFoodPosition;
    
    /* Bucle que se ejecuta hasta encontrar una posición no ocupada por la serpiente. */
    while (newFoodPosition == null || this.snake.onSnake(newFoodPosition)) {
      newFoodPosition = randomGridPosition() // Genera una nueva posición aleatoria en el tablero.
    }
    return newFoodPosition; // Retorna la nueva posición válida para la comida.
  }

  /* Propiedad para gestionar la puntuación. Para umentar la puntuación del juego. */
  set addScore(val: number) {
    this.score += val;
  }

  /* Propiedad para obtener la puntuación actual. */
  get currentScore() {
    return this.score;
  }
}
