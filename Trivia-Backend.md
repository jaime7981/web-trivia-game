# P2 - Trivia Backend Doc

## Crear cuenta ✓

`https://trivia-bck.herokuapp.com/registration/`

 - Pueden crear cuantas cuentas quieran
 - Usen como prefijo de nombre GX_ donde X es el número de su grupo (e.g. G2_pepito, G4_jim,  G13_lalala)

## Login ✓

`https://trivia-bck.herokuapp.com/api/token/`
 
 - Autentificación en base a JWT.
 - Parámetros:
     - method --> POST
     - Content-Type --> JSON
     - params --> username, password
 - Retorno:
     - token_access (válido por 5 minutos)
     - token_refresh (válido por 24 horas)
 - Uso --> Authorization: Bearer token_access
 - Cuando vence el token_access pueden pedir uno nuevo en `https://trivia-bck.herokuapp.com/api/token/refresh`
     - method --> POST
     - Content-Type --> JSON
     - params --> refresh: token_refresh

## Juegos ✓

`https://trivia-bck.herokuapp.com/api/games/`
    
 - Obtener los juegos abiertos
     - method --> GET
 - Crear juego
     - method --> POST
     - Content-Type --> JSON
     - params --> name, question_time, answer_time
 - Unirse a un juego
     - `https://trivia-bck.herokuapp.com/api/games/gameid/join_game/`
     - method --> POST
 - Eliminar un juego
     - `https://trivia-bck.herokuapp.com/api/games/gameid/`

     - method --> DELETE
     - Válida que solo pueda eliminarlo el usuario que lo creó.

## Jugar - WebSocket

`wss://trivia-bck.herokuapp.com/ws/trivia/gameid/?token=token_access`

 - Comunicación por JSON, diccionario con parámetros.
 - Nuevo jugador se unió al juego (receive) ✓ 
     - type --> player_joined
     - userid, username
 - Comenzar juego (send) ✓
     - action --> start
     - rounds
 - Juego comenzó (receive) ✓
     - type --> game_started
     - rounds, players
 - Comienza ronda (receive) ✓
     - type --> round_started
     - round_number, nosy_id
 - Enviar pregunta (send) ✓
     - action --> question
     - text
 - Recibir pregunta (receive) ✓  
     - type --> round_question
     - question
 - Fin tiempo para enviar pregunta (receive)
     - type --> question_time_ended
     - Se reinicia la ronda eligiendo otro preguntón (puede ser el mismo).
 - Enviar respuesta (send)✓
     - action --> answer
     - text
 - Recibir respuesta (receive)✓   
     - type --> round_answer
     - answer, userid
 - Fin tiempo respuestas (receive)
     - type --> round_ended
 - Enviar calificación (send)
     - action --> qualify
     - userid, grade (0, 1, 2)
 - Recibir respuesta para evaluar (receive)   
     - type --> round_review_answer
     - correct_answer, graded_answer, grade
 - Enviar evaluación (send)
     - action --> assess
     - correctness (true, false)
 - Resultado de la ronda (receive)
     - type --> round_result
     - userid (key), score (value)
 - Fin del juego (receive)
     - type --> game_result
     - userid (key), score (value)
 - Fin tiempo pregunta (receive)
     - type --> question_timeout
 - Fin tiempo calificaciones (receive)
     -type --> assess_timeout
 - Falta de algún usuario (receive)
     - type --> user_fault
     - userid, type
 - Usuario descalificado (receive)
     - type --> user_disqualified
     - userid
