import { Player, createPlayerStatusList } from "./player.js";

export class TriviaGame {
    constructor(gameId) {
        this.gameId = gameId;
        this.nosyId = 0;
        this.nosyPlayer = null;
        this.players = [];
        this.answers = [];
        this.rounds = 0;
        this.roundNumber = 0;
        this.question = "";
    }

    getPlayerById(playerId) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == playerId) {
                return this.players[i];
            }
        }
        return false;
    }

    isPlayerJoined(player) {
        for (let playerPosition = 0; player < this.players.length; player++) {
            if (this.players[playerPosition].id == player.id) {
                return true;
            }
        }
        return false;
    }

    playerJoined(userId, username) {
        let newPlayer = new Player(userId, username);
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id == userId) {
                return true;
            }
        }
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

    playerDisqualify(userId) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id == userId) {
                this.players[i].playerKO = true;
                break;
            }
        }
        createPlayerStatusList(this.players);
    }

    userFault(userId, category) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id == userId) {
                this.players[i].playerFaults = this.players[i].playerFaults + 1;
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
        this.players = [];
        
        for (let i = 0; i < players.length; i ++) {
            let newPlayer = new Player(players[i].userid, players[i].username);
            this.players.push(newPlayer);
        }
        createPlayerStatusList(this.players);
    }

    roundStarted(roundNumber, nosyId) {
        this.roundNumber = roundNumber;
        this.nosyId = nosyId;
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id == nosyId) {
                this.nosyPlayer = this.players[i];
                this.players[i].isNosy = true;
            }
            else {
                this.players[i].isNosy = false;
            }
        }
        createPlayerStatusList(this.players);
    }

    recieveQuestion(question) {
        this.question = question;
    }

    recieveAnswers(answer, userId) {
        let userAnswer = new Answer(answer, userId, this.roundNumber);
        this.answers.push(userAnswer);
    }

    recieveReview(correct_answer, graded_answer, grade) {
        // console.log(correct_answer, graded_answer, grade);
    }

    roundResult(game_scores, round_results) {
        /*
        {game_scores:{15: 2, 196: 0, 198: -2},
         round_results: {15: 2, 196: 0, 198: -2},
         type: "round_result"}
        */
        Object.entries(game_scores).forEach(([k,v]) => {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].id.toString() === k.toString()) {
                    this.players[i].playerScore = v;
                    break;
                }
            }
        });
        createPlayerStatusList(this.players);
    }

    questionTimeEnded() {
        console.log("Se reinicia la ronda eligiendo otro preguntón (puede ser el mismo).");
    }

    answerTimeEnded() {
        console.log("Se envía siempre a todos los jugadores, indica que comienza el tiempo para calificación.");
    }

    assessTimeEnded() {
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