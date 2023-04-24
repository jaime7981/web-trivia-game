
export class TriviaWebSocket {
    constructor(gameId, accessToken = null) {
        if (gameId == null) {
            this.gameId = 0;
        }
        else {
            this.gameId = gameId;
        }

        if (accessToken == null) {
            this.token = localStorage.getItem("access_token");        
        }
        else {
            this.token = accessToken;
        }

        if (gameId == null) {
            this.socket = null;
        }
        else {
            this.socket = new WebSocket(`wss://trivia-bck.herokuapp.com/ws/trivia/${this.gameId}/?token=${this.token}`);
        }
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
            console.log("Message from server ", event.data);
        });
    }

    sendMessage(action, message) {
        if (this.socket == null) {
            return false;
        }

        console.log(this.socket.readyState);
        let socketJsonMessage = {"action":action, "text":message};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }

    startGame(rounds) {
        if (this.socket == null) {
            return false;
        }
        
        console.log(this.socket.readyState);
        let socketJsonMessage = {"action":"start", "rounds":rounds};
        this.socket.send(JSON.stringify(socketJsonMessage));
    }
}
