# P2 - Enunciado

Deberán crear el frontend de un juego estilo Trivia para jugar con otras personas por Internet.
## Instrucciones Juego
### Ronda
 - El juego puede ser jugado de 3 a 12 jugadores.
 - En cada ronda se define un jugador para ser el preguntón.
 - El preguntón crea una pregunta la cual es enviada al resto de jugadores.
 - Cada jugador ingresa su respuesta en un tiempo definido, incluyendo el preguntón quien debe ingresar la respuesta correcta.
 - A medida que llegan las respuestas, el preguntón debe calificar la correctitud de ellas: buena, mas o menos, mala.
 - Terminada la corrección, cada jugador recibirá la respuesta correcta, una respuesta dada por un compañero y la evaluación del preguntón, debiendo calificar si la evaluación les parece correcta o no.

Terminada la ronda se asigna el puntaje para cada jugador:
 - Según correctitud de la respuesta: (2) buena, (1) mas o menos, (0) mala.
 - Para el preguntón se asigna según calificación de la evaluación:
     - 3 ptos. si 80% o más la calificaron correcta o no la calificaron
     - 1 pto. si más o igual a 50% y menos que 80% la calificaron correcta o no la calificaron,
     - -2 ptos. si más del 50% la calificaron como no correcta.

Terminada la ronda se escoge al siguiente preguntón:
 - Considerando N jugadores, en las primeras N rondas le tocará ser preguntón a cada uno de ellos (orden aleatorio).
 - Desde la ronda N+1 el preguntón será el que tenga menos puntaje, pero sin poder ser preguntón dos rondas seguidas.    

El juego lo gana quien terminadas las M rondas, definidas al comienzo del juego, obtenga el mayor puntaje.
 - siempre deberá darse que M >= N

### Tiempos

Cada acción en el juego tiene un tiempo máximo para realizarla:
 - Enviar pregunta $\rightarrow$ configurable al crear la partida: 60s, 90s, 120s.
 - Enviar respuesta $\rightarrow$ configurable al crear la partida: 60s, 90s, 120s.
 - Enviar evaluaciones $\rightarrow$ 90s adicionales desde que termina el tiempo para respuestas.
 - Enviar calificación de evaluación $\rightarrow$ 30s.

### Descalificación

Durante un juego un jugador podrá ser descalificado, lo que implica que pierde y no podrá seguir jugando.

La descalificación se dará cuando se cumplan 3 faltas, considerándose las siguientes posibles faltas:
 - No entregar la pregunta a tiempo siendo el preguntón (está es doble falta). En este caso la ronda se anula y se define un nuevo preguntón.
 - No entregar una respuesta a tiempo (también corre para el preguntón con la respuesta correcta).
 - Siendo preguntón, no entregar una o más evaluaciones en una ronda. Las evaluaciones no entregadas reciben la evaluación máxima.
 - No entregar la calificación de la evaluación.
 - No tener el foco en el sitio. Esto será controlado por el profesor durante la entrega final.

### Detalles frontend

Características que deberá considerar para su frontend:
 - Loguearse (deberán crearse una cuenta previamente).
 - Crear una nueva partida o unirse a una ya existente.
 - Iniciar la partida (sólo quien la crea).
 - Permitir toda la interacción del juego según corresponda al jugador: crear pregunta, enviar respuesta, calificar evaluación.
 - Mantener visible y actualizado el estado del juego.
 - Mostrar el estado de cada jugador actualizado: nombre, puntaje, quién es el preguntón, cuántas faltas lleva, si está descalificado.
 - Mostrar siempre contadores de tiempo para las actividades que lo consideran.

Deberá proveer de ayuda al jugador para la respuesta:
 - La ayuda se debe hacer utilizando APIs públicas disponibles.
 - Consiste en mostrar información al usuario de manera automatizada respecto a la pregunta.
     - Esto implica que el usuario no debe ingresar información para el llamado a las APIs sino que esto debe hacerse de forma automática al recibir la pregunta mostrando lo conseguido al usuario.
     - La ayuda NO pueden ser links, ya que no se puede perder el foco en el juego.
 - Deberá usar al menos dos APIs distintas para ello.

Todas las preguntas del juego deberán ser referentes a películas o series que cumplan lo siguiente:
 - Deben ser películas o series que estén disponibles para Chile en alguno de los siguientes servicios de streaming: Netflix, HBO Max, Star+, Amazon Prime Video, Apple TV.
 - Estrenadas desde 1990 en adelante.

En la calificación de la respuesta también se incluye calificar que la pregunta esté correctamente en el tema.

### Restricciones y permisos
 - Desarrollo en parejas (o individual).
 - Pueden utilizar librerías externas de JS y CSS (No pueden usar frameworks de frontend).
 - Todo el estilo debe ser manejado en archivos CSS, no puede haber nada de estilo directo en los archivos HTML.
 - Los archivos HTML no pueden tener javascript, todo debe realizarse en archivos .js específicos.
 - Sin manejo de estilos directo en javascript (solo a través de clases).
 - Estrictamente prohíbido utilizar elementos table para layout.

