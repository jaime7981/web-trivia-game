import { Player, createPlayerStatusList } from "./player.js";

export class TriviaGame {
    constructor(gameId) {
        this.gameId = gameId;
        this.players = [];
        this.answers = [];
        this.rounds = 0;
        this.roundNumber = 0;
        this.question = "";
    }

    playerJoined(userId, username) {
        let newPlayer = new Player(userId, username);
        this.players.push(newPlayer);
        createPlayerStatusList(this.players);
    }

    playerUnjoined(userId, username) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id == userId) {
                this.players.splice(i, 1);
                break;
            }
        }
        createPlayerStatusList(this.players);
    }

    deletedGame(game) {
        window.location.href = "./games.html";
    }
    
    gameStarted(rounds, players) {
        this.rounds = rounds;
        
        for (let i = 0; i < players.length; i ++) {
            let newPlayer = new Player(players[i].userid, players[i].username);
            this.players.push(newPlayer);
        }
        createPlayerStatusList(this.players);
    }

    roundStarted(roundNumber, nosyId) {
        console.log(roundNumber, nosyId);
        this.roundNumber = roundNumber;
    }

    recieveQuestion(question) {
        console.log(question);
        this.question = question;
    }

    recieveAnswers(answer, userId) {
        let userAnswer = new Answer(answer, userId, this.roundNumber);
        this.answers.push(userAnswer);
    }

    questionTimeEnded() {
        console.log("Se reinicia la ronda eligiendo otro preguntón (puede ser el mismo).");
    }

    endSendAnswerTime() {
        console.log("Se envía siempre a todos los jugadores, indica que comienza el tiempo para calificación.");
    }

    endSendAnswerTime() {
        console.log("Se envía solo si aun faltan calificaciones por realizar (se envía a todos).");
    }
}

class Answer {
    constructor(answer, userId, round) {
        this.answer = answer;
        this.userId = userId;
        this.round = round;
    }
}