
class Game {
    constructor(id, creator, created, player_count, name, question_time, answer_time, rounds_number, started, ended, players) {
        this.id = id;
        this.creator = creator;
        this.created = created;
        this.player_count = player_count;
        this.name = name;
        this.question_time = question_time;
        this.answer_time = answer_time;
        this.rounds_number = rounds_number;
        this.started = started;
        this.ended = ended;
        this.players = players;
    }
}

class Player {
    constructor(playerName, playerId, playerStatus, playerScore, playerPregunton, playerFaults, playerKO) {
        this.name = playerName;
        this.id = playerId;
        this.status = playerStatus;
        this.playerScore = playerScore;
        this.playerPregunton = playerPregunton;
        this.playerFaults = playerFaults;
        this.playerKO = playerKO;
    }
}

class TriviaWebSocket {
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

    loadWebSocketEventlisteners() {
        this.socket.addEventListener("open", (event) => {
            this.socket.send("Hello Server!");
            console.log("Message sent to server");
        });

        this.socket.addEventListener("close", (event) => {
            // window.location = "./games.html";
            console.log("closed conection to the server");
        });

        this.socket.addEventListener("error", (event) => {
            // window.location = "./games.html";
            console.log("WebSocket Error: ", event.data);
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
}

function createPlayerStatusList(playerList) {
    let asideRight = document.getElementsByClassName("aside-right");

    if (asideRight[0] == null) {
        return false;
    }

    let headerName = document.createElement("h2");
    headerName.textContent = "Players";
    asideRight[0].appendChild(headerName);

    let headerNames = document.createElement("h5");
    headerNames.textContent = "Name | ID | Status | Score | Asker | Faults | KO";
    asideRight[0].appendChild(headerNames);

    let gameStatusList = document.createElement("div");
    gameStatusList.className = "players-status-aside";

    playerList.forEach(player => {
        let playerContent = document.createElement("div");

        let playerName = document.createElement("span");
        playerName.textContent = player.name;
        playerContent.appendChild(playerName);
        playerContent.appendChild(document.createTextNode(" | "));

        let playerId = document.createElement("span");
        playerId.textContent = player.id;
        playerContent.appendChild(playerId);
        playerContent.appendChild(document.createTextNode(" | "));

        let playerStatus = document.createElement("span");
        playerStatus.textContent = player.status;
        playerContent.appendChild(playerStatus);
        playerContent.appendChild(document.createTextNode(" | "));

        let playerScore = document.createElement("span");
        playerScore.textContent = player.playerScore;
        playerContent.appendChild(playerScore);
        playerContent.appendChild(document.createTextNode(" | "));

        let playerPregunton = document.createElement("span");
        playerPregunton.textContent = player.playerPregunton;
        playerContent.appendChild(playerPregunton);
        playerContent.appendChild(document.createTextNode(" | "));

        let playerFaults = document.createElement("span");
        playerFaults.textContent = player.playerFaults;
        playerContent.appendChild(playerFaults);
        playerContent.appendChild(document.createTextNode(" | "));

        let playerKO = document.createElement("span");
        playerKO.textContent = player.playerKO;
        playerContent.appendChild(playerKO);

        gameStatusList.appendChild(playerContent);
    });
    asideRight[0].appendChild(gameStatusList);

    return true;
}

function debugActionButtons(socket) {
    let sectionCenter = document.getElementsByClassName("section-center");

    let debugBlock = document.createElement("div");
    debugBlock.className = "debug-block";

    let sendMessageToSocket = document.createElement("button");
    sendMessageToSocket.innerHTML = "send debug data";

    let setActionSocketTextInput = document.createElement("input");
    setActionSocketTextInput.type = "text";
    setActionSocketTextInput.placeholder = "action";

    let sendMessageToSocketTextInput = document.createElement("input");
    sendMessageToSocketTextInput.type = "text";
    sendMessageToSocketTextInput.placeholder = "text data";

    if (sectionCenter[0] == null) {
        return false;
    }

    debugBlock.appendChild(setActionSocketTextInput);
    debugBlock.appendChild(sendMessageToSocketTextInput);
    debugBlock.appendChild(sendMessageToSocket);
    sectionCenter[0].appendChild(debugBlock);

    sendMessageToSocket.addEventListener("click", function (e) {
        let textValue = sendMessageToSocketTextInput.value;
        let actionValue = setActionSocketTextInput.value;
        console.log("action: " + actionValue);
        console.log("text: " + textValue);
        socket.sendMessage(textValue, actionValue);
    });
}

window.onload = function pageonLoad() {
    console.log("loaded trivia-backend.js");

    let socket = new TriviaWebSocket(114);
    socket.loadWebSocketEventlisteners();
    
    socket.onmessage = (event) => {
        console.log(event.data);
    };

    debugActionButtons(socket);

    let playersTestData = [];
    playersTestData.push(
        new Player("player one", 1, "connected", 0, 0, 0, 0),
        new Player("player two", 2, "connected", 0, 0, 0, 0),
        new Player("player three", 3, "waiting", 0, 0, 0, 0)
    );

    createPlayerStatusList(playersTestData);

}
