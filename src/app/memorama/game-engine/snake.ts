/* Importes de archivos. */
import { UserKeyInput } from "./input";

/* Exportamos la constante speed y la clase snake. */ 
export const SNAKE_SPEED = 7; // Define la velocidad de la serpiente.

 
export class Snake {

  /* Objeto que define las coordenadas de la serpiente nada más empezar el juego. */ 
  snakeBody = [ 
    { x: 11, y: 11 }  // Exactamente en (x: 11, y: 11), es decir, en la fila 11 y la columna 11 del tablero.
  ]; 

  
  newSegments = 0; // Contador para los nuevos segmentos que se agregarán.

  /* Instancia para manejar las entradas del usuario: 
   UserKeyInput(): Capturar y gestionar las teclas presionadas por el usuario
   para convertirlas en direcciones de movimiento para la serpiente. */
  input = new UserKeyInput();

  /* Método para escuchar y captura las entradas del usuario (como las teclas de flecha). */
  listenToInputs() {
    this.input.getInputs();
  }

  /* Método que actualiza la posición de la serpiente:
  Si la serpiente ha recogido comida, se agrega un segmento a su longitud. */
  update() {
    this.addSegments(); // Agregar nuevos segmentos si es necesario
    const inputDirection =  this.input.getInputDirection(); // Obtiene la dirección de entrada actual del usuario, es decir, obtiene la dirección hacia la cual la serpiente debe moverse.

    /* Mueve los segmentos del cuerpo de la serpiente uno detrás del otro. */
    for (let i = this.snakeBody.length - 2; i >= 0; i--) {  

      this.snakeBody[i + 1] = { ...this.snakeBody[i] } // Copia la posición del segmento actual (this.snakeBody[i]) al siguiente segmento.
    }

    /* Actualizar la posición de la cabeza de la serpiente en función de la dirección de entrada actual. */
    this.snakeBody[0].x += inputDirection.x; // Cambia la posición horizontal de la cabeza.
    this.snakeBody[0].y += inputDirection.y; // Cambia la posición vertical de la cabeza.
  }

  /* Método que dibuja la serpiente en el tablero del juego.
  Toma un argumento (gameBoard) que representa el elemento del DOM donde se dibujará la serpiente.
  El tipo any se utiliza para indicar que gameBoard puede ser cualquier tipo de objeto. */
  draw(gameBoard: any) {
    this.snakeBody.forEach(segment => { // Recorre cada segmento de la serpiente
      const snakeElement = document.createElement('div');  // Crea un div para para visualizar un segmento de la serpiente.
      
      /* Establece la posición del segmento en el tablero de rejilla */
      snakeElement.style.gridRowStart = segment.y.toString();
      snakeElement.style.gridColumnStart = segment.x.toString();

      /* Configura el color y el aspecto del segmento. */ 
      snakeElement.style.backgroundColor = '#8DB602';
      snakeElement.style.border =  '0.25vmin solid black';
      snakeElement.style.transition =  'all .3ms ease-in';

      /* Crea un div para visualizar un segmento de la serpiente.
      Puede ser util en términos de diseño.*/
      snakeElement.classList.add('snake');
      
      gameBoard.appendChild(snakeElement); // Agrega un segmento al tablero del juego como hijo del elemento gameBoard

    });
  }

  /* Método para expandir la serpiente en una cierta cantidad. */
  expandSnake(amount: number) { // Representa la cantidad de segmentos adicionales que se deben agregar a la serpiente.
    this.newSegments += amount; 
  }

  // Método que devuelve la cabeza de la serpiente.
  getSnakeHead() {
    return this.snakeBody[0]; // Devuelve el primer elemento (índice 0).
  }

  // Método que verifica si la serpiente se cruza a sí misma.
  snakeIntersection() {
    return this.onSnake(this.snakeBody[0], { ignoreHead: true });
  }

  // Método que verifica si una posición está ocupada por la serpiente.
  onSnake(position: any, { ignoreHead = false } = {}) {
    return this.snakeBody.some((segment, index) => {
      if (ignoreHead && index === 0) return false;
      return this.equalPositions(segment, position);
    })
  }

  /* Método que verifica si dos posiciones son iguales.
  Si la cabeza de la serpiente se superpone con algún otro segmento de su cuerpo, devolverá true,
  lo que indica una colisión de la serpiente consigo misma. De lo contrario, devolverá false.*/
  equalPositions(pos1: any, pos2: any) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  /* Método para agregar nuevos segmentos a la serpiente:
  Agrega un nuevo segmento y este segmento se copia del último segmento existente
  en el cuerpo de la serpiente. 
  Esto ocurre cuando la serpiente come comida y así crece su longitud.*/
  addSegments() {
    for (let i = 0; i < this.newSegments; i++) {
      this.snakeBody.push({ ...this.snakeBody[this.snakeBody.length - 1] }); // Crea una copia independiente del último segmento, de modo que los cambios en uno no afecten a los otros.
    }

    this.newSegments = 0; // Se restablece a 0, ya que todos los segmentos han sido agregados y no es necesario agregar más hasta que se acumulen de nuevo.
  }
}
