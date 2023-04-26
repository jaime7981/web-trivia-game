import { TriviaGame } from "./trivia-game.js";
import * as triviaViews from "./trivia-views.js";

export class TriviaWebSocket {
    constructor(gameId, accessToken = null) {
        if (accessToken == null) {
            this.token = localStorage.getItem("access_token");        
        }
        else {
            this.token = accessToken;
        }

        if (gameId == null) {
            this.gameId = 0;
            this.socket = null;
        }
        else {
            this.gameId = gameId;
            this.socket = new WebSocket(`wss://trivia-bck.herokuapp.com/ws/trivia/${this.gameId}/?token=${this.token}`);
        }

        this.triviaGame = new TriviaGame(this.gameId);
    }

    restartWebSocket() {
        this.token = localStorage.getItem("access_token");
        this.socket = new WebSocket(`wss://trivia-bck.herokuapp.com/ws/trivia/${this.gameId}/?token=${this.token}`);
        this.loadWebSocketEventlisteners();
    }

    loadWebSocketEventlisteners() {
        if (this.socket == null) {
            return false;
        }

        this.socket.addEventListener("open", (event) => {
            console.log("Web socket open");
        });

        this.socket.addEventListener("close", (event) => {
            console.log("Closed conection to the server");
            this.restartWebSocket();
        });

        this.socket.addEventListener("error", (event) => {
            console.log("WebSocket Error: ", event);
        });

        this.socket.addEventListener("message", (event) => {
            this.recieveMessage(event.data);
        });
    }

    recieveMessage(serverResponse) {
        let jsonResponse = JSON.parse(serverResponse);
        let responseType = jsonResponse.type;

        console.log(jsonResponse);

        switch (responseType) {
            case 'error':
                console.log("Error: " + jsonResponse.message);
                break;
            case 'player_joined':
                this.triviaGame.playerJoined(jsonResponse.userid, jsonResponse.username);
                break;
            case 'player_unjoined':
                this.triviaGame.playerUnjoined(jsonResponse.userid, jsonResponse.username);
                break;
            case 'game_deleted':
                this.triviaGame.deletedGame(jsonResponse.game);
                break;
            case 'game_started':
                this.triviaGame.gameStarted(jsonResponse.rounds, jsonResponse.players);
                // TODO: load game Start View
                break;
            case 'round_started':
                this.triviaGame.roundStarted(jsonResponse.round_number, jsonResponse.noisy_id);
                triviaViews.askQuestion(this.socket);

                // TODO: add recieve question clocks
                break;
            case 'round_question':
                this.triviaGame.recieveQuestion(jsonResponse.question);
                // TODO: load nosy send answer and other functionalities
                // TODO: load player send answer and wait review

                // TODO: add send answer clocks
                break;
            case 'round_answer':
                this.triviaGame.recieveAnswers(jsonResponse.answer, jsonResponse.userid);
                break;
            case 'question_time_ended':
                this.triviaGame.questionTimeEnded();
                // TODO: load send answer view
                triviaViews.sendAnswer(this.socket);
                break;
            default:
                console.log(`Type '${responseType}' not handeled`);
            }
    }

    sendMessage(action, message) {
        if (this.socket == null) {
            return false;
        }

        console.log(this.socket.readyState);
        let socketJsonMessage = {"action":action, "text":message};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }

    startGame(rounds = 10) {
        if (this.socket == null) {
            return false;
        }

        console.log(this.socket.readyState);
        let socketJsonMessage = {"action":"start", "rounds":rounds};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }

    sendQuestion(question = "") {
        if (this.socket == null) {
            return null;
        }

        let socketJsonMessage = {"action":"question", "text":question};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }

    sendAnswer(answer = "") {
        if (this.socket == null) {
            return null;
        }

        let socketJsonMessage = {"action":"answer", "text":answer};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }

    sendQualification(userId, qualification = 0) {
        if (this.socket == null) {
            return null;
        }

        let socketJsonMessage = {"action":"qualify", "userid":userId, "grade":qualification};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }

    sendEvaluation(correctness  = false) {
        if (this.socket == null) {
            return null;
        }

        let socketJsonMessage = {"action":"assess", "correctness":correctness};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }
}
