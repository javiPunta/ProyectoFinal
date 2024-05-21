const GRID_SIZE = 21 // Tamaño del tablero del juego.

/* Exporta 2 funciones. */ 

/* Función que genera una posición aleatoria en el tablero.
Es útil para colocar elementos aleatorios en el juego,
como la posición inicial de la comida o la ubicación de otros objetos. */ 
export function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1
  }
}

/* Función que verifica si una posición está fuera del tablero. 
Es útil para evitar que la serpiente o los objetos del juego se desplacen más allá del tablero.*/
export function outsideGrid(position: any) {
  return (
    position.x < 1 || position.x > GRID_SIZE ||
    position.y < 1 || position.y > GRID_SIZE
  )
}
