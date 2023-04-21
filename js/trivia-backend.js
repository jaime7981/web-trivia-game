
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
            //this.socket.send("Hello Server!");
            //console.log("Message sent to server");
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

    startGame(rounds) {
        console.log(this.socket.readyState);
        let socketJsonMessage = {"action":"start", "rounds":rounds};
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

function cleanSectionCenterContent() {
    let sectionCenter = document.getElementsByClassName("section-center");

    while (sectionCenter[0].firstChild) {
        sectionCenter[0].removeChild(sectionCenter[0].firstChild);
    }
}

function askQuestion() {
    let sectionCenter = document.getElementsByClassName("section-center");

    if (sectionCenter[0] == null) {
        return false;
    }

    let headerName = document.createElement("h2");
    headerName.textContent = "Ask Question";
    sectionCenter[0].appendChild(headerName);

    let questionDiv = document.createElement("div");
    questionDiv.className = "question-div";

    let questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.placeholder = "Question";
    questionDiv.appendChild(questionInput);

    let questionAnswer = document.createElement("input");
    questionAnswer.type = "text";
    questionAnswer.placeholder = "Answer";
    questionDiv.appendChild(questionAnswer);

    let questionButton = document.createElement("button");
    questionButton.innerHTML = "Send Question";
    questionDiv.appendChild(questionButton);

    sectionCenter[0].appendChild(questionDiv);

    questionButton.onclick = function() {
        let question = questionInput.value;
        let answer = questionAnswer.value;
        let questionJson = {"question":question, "answer":answer};
        
        let doneMessage = document.createElement("span");
        doneMessage.textContent = "Question sent";
        questionDiv.appendChild(doneMessage);
    }

    return true
}

function loadRecievedAnswers(playerList) {
    let sectionCenter = document.getElementsByClassName("section-center");

    if (sectionCenter[0] == null) {
        return false;
    }

    let headerName = document.createElement("h2");
    headerName.textContent = "Answers Points";
    sectionCenter[0].appendChild(headerName);

    let answersEvaluation = document.createElement("div");

    playerList.forEach(player => {
        let playerAnswersContent = document.createElement("div");

        let playerName = document.createElement("span");
        playerName.textContent = player.name;
        playerAnswersContent.appendChild(playerName);
        playerAnswersContent.appendChild(document.createTextNode(" | "));
        
        let playerAnswer = document.createElement("span");
        playerAnswer.textContent = "playerTestAnswer";
        playerAnswersContent.appendChild(playerAnswer);
        playerAnswersContent.appendChild(document.createTextNode(" | "));

        // Answers Evaluation
        let answerPoints = document.createElement("select");
        let answerPointsGood = document.createElement("option");
        let answerPointsMedium = document.createElement("option");
        let answerPointsBad = document.createElement("option");

        answerPointsGood.value = 2;
        answerPointsMedium.value = 1;
        answerPointsBad.value = 0;

        answerPointsGood.innerHTML = "good";
        answerPointsMedium.innerHTML = "medium";
        answerPointsBad.innerHTML = "bad";

        answerPoints.appendChild(answerPointsGood);
        answerPoints.appendChild(answerPointsMedium);
        answerPoints.appendChild(answerPointsBad);
        
        playerAnswersContent.appendChild(answerPoints);

        answersEvaluation.appendChild(playerAnswersContent);
    });
    sectionCenter[0].appendChild(answersEvaluation);

    let rateAnswersButton = document.createElement("button");
    rateAnswersButton.innerHTML = "Send Ratings";
    sectionCenter[0].appendChild(rateAnswersButton);

    return true;
}

function debugActionButtons(socket) {
    let sectionCenter = document.getElementsByClassName("section-center");

    let headerName = document.createElement("h2");
    headerName.textContent = "WebSocket Debug";
    sectionCenter[0].appendChild(headerName);

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

    // Socket test
    let socket = new TriviaWebSocket(114);
    socket.loadWebSocketEventlisteners();

    let startGameButton = document.getElementById("start-game-button");
    startGameButton.addEventListener("click", function (e) {
        socket.startGame(5);
    })
    
    socket.onmessage = (event) => {
        console.log(event.data);
    };

    // Fake player data
    let playersTestData = [];
    playersTestData.push(
        new Player("player one", 1, "connected", 0, 0, 0, 0),
        new Player("player two", 2, "connected", 0, 0, 0, 0),
        new Player("player three", 3, "waiting", 0, 0, 0, 0)
    );

    // Load initial data
    createPlayerStatusList(playersTestData);

    // Create and load side panels buttons
    let asideLeftBlock = document.getElementsByClassName("aside-left");
    
    let rateAnswersButton = document.createElement("button");
    rateAnswersButton.innerHTML = "Rate Answers";
    asideLeftBlock[0].appendChild(rateAnswersButton);

    let askQuestionButton = document.createElement("button");
    askQuestionButton.innerHTML = "Ask Question";
    asideLeftBlock[0].appendChild(askQuestionButton);

    let debugButton = document.createElement("button");
    debugButton.innerHTML = "WebSocket Debug";
    asideLeftBlock[0].appendChild(debugButton);

    rateAnswersButton.addEventListener("click", function (e) {
        cleanSectionCenterContent();
        loadRecievedAnswers(playersTestData);
    })

    askQuestionButton.addEventListener("click", function (e) {
        cleanSectionCenterContent();
        askQuestion();
    })

    debugButton.addEventListener("click", function (e) {
        cleanSectionCenterContent();
        debugActionButtons(socket);
    })

}
