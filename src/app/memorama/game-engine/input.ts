/* Exporta la clase para manejar las entradas del usuario. */
export class UserKeyInput {

  /* Dirección de entrada actual y última dirección. */
  inputDirection = { x: 0, y: 0 };
  lastInputDirection = { x: 0, y: 0 };

  /* Método para escuchar las entradas del usuario al presionar las teclas. */
  getInputs() {
    window.addEventListener('keydown', e => { //Cuando presione la tecla
      this.setDirection(e.key);// se llama a la función, en donde e.key representa la tecla que ha presionado.
    })
  }

  /* Método para cambiar la dirección de entrada.
  Se verifica si la última dirección de entrada (this.lastInputDirection) es opuesta a la nueva dirección. 
  Esto se hace para evitar que la serpiente se revierta sobre sí misma.
  Si la dirección opuesta se detecta, se ignora la nueva dirección para evitar una colisión consigo misma.
  Si no se detecta una dirección opuesta, se actualiza la propiedad inputDirection con la dirección correspondiente.
  Ej: si se presiona la tecla 'ArrowUp' y la última dirección de entrada no fue hacia abajo
  (es decir, this.lastInputDirection.y no es igual a 0), entonces se establece this.inputDirection en { x: 0, y: -1 },
  lo que indica que la serpiente debe moverse hacia arriba.
  */
  setDirection(direction: string) {
    switch (direction) {
      case 'ArrowUp':
        if (this.lastInputDirection.y !== 0) break;
        this.inputDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (this.lastInputDirection.y !== 0) break;
        this.inputDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (this.lastInputDirection.x !== 0) break;
        this.inputDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (this.lastInputDirection.x !== 0) break;
        this.inputDirection = { x: 1, y: 0 };
        break;
    }
  }

  /* Método que devuelve la dirección de movimiento actual de la serpiente y actualiza
  la dirección de la última entrada, lo que permite que la serpiente se mueva en la dirección
  especificada por el jugador en cada ciclo de actualización del juego. */
  getInputDirection() {
    this.lastInputDirection = this.inputDirection;
    return this.inputDirection;
  }
}
