
export class TriviaWebSocket {
    constructor(gameId, accessToken = null) {
        this.gameId = gameId;

        if (accessToken == null) {
            this.token = localStorage.getItem("access_token");        
        }
        else {
            this.token = accessToken;
        }

        this.socket = new WebSocket(`wss://trivia-bck.herokuapp.com/ws/trivia/${this.gameId}/?token=${this.token}`);
    }

    restartWebSocket() {
        this.token = localStorage.getItem("access_token");
        this.socket = new WebSocket(`wss://trivia-bck.herokuapp.com/ws/trivia/${this.gameId}/?token=${this.token}`);
        this.loadWebSocketEventlisteners();
    }

    loadWebSocketEventlisteners() {
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
            console.log("Message from server ", event.data);
        });
    }

    sendMessage(action, message) {
        console.log(this.socket.readyState);
        let socketJsonMessage = {"action":action, "text":message};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }

    startGame(rounds) {
        console.log(this.socket.readyState);
        let socketJsonMessage = {"action":"start", "rounds":rounds};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }
}
