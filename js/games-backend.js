
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

Game.prototype.createGameNode = function() {
    const gameNode = document.createElement('div');
    gameNode.className = "game-data";

    const nameNode = document.createElement('h3');
    nameNode.textContent = this.name;
    gameNode.appendChild(nameNode);

    const questionTimeNode = document.createElement('span');
    questionTimeNode.textContent = `Question Time: ${this.question_time} seconds`;
    gameNode.appendChild(questionTimeNode);
  
    const answerTimeNode = document.createElement('span');
    answerTimeNode.textContent = `Answer Time: ${this.answer_time} seconds`;
    gameNode.appendChild(answerTimeNode);
  
    const roundsNode = document.createElement('span');
    roundsNode.textContent = `Rounds: ${this.rounds_number}`;
    gameNode.appendChild(roundsNode);

    const playerCountNode = document.createElement('span');
    playerCountNode.textContent = `Player count: ${this.player_count}`;
    gameNode.appendChild(playerCountNode);

    const playersNode = document.createElement('div');
    playersNode.textContent = 'Players:';
    gameNode.appendChild(playersNode);
    for (const player of this.players) {
      const playerNode = document.createElement('p');
      playerNode.textContent = player;
      playersNode.appendChild(playerNode);
    }
  
    const idNode = document.createElement('span');
    idNode.textContent = `ID: ${this.id}`;
    gameNode.appendChild(idNode);
  
    const creatorNode = document.createElement('span');
    creatorNode.textContent = `Creator: ${this.creator}`;
    gameNode.appendChild(creatorNode);
  
    const createdNode = document.createElement('span');
    createdNode.textContent = `Created: ${this.created}`;
    gameNode.appendChild(createdNode);
  
    const startedNode = document.createElement('span');
    startedNode.textContent = `Started: ${this.started}`;
    gameNode.appendChild(startedNode);
  
    const endedNode = document.createElement('span');
    endedNode.textContent = `Ended: ${this.ended}`;
    gameNode.appendChild(endedNode);

    if (this.started == null) {
        const joinButtonNode = document.createElement('button');
        const gameId = this.id;
        joinButtonNode.addEventListener("click", function (e) {
            joinGameRequest(httpRequest, gameId);
        });
        joinButtonNode.textContent = "JOIN GAME";
        gameNode.appendChild(joinButtonNode);
    }

    return gameNode;
};

function loadAllGamesRequest(httpRequest) {
    let access_token = localStorage.getItem("access_token");

    if (isValidToken(access_token) == false) {
        return null;
    }
    
    httpRequest.onreadystatechange = loadAllGamesResponse;
    httpRequest.open("GET", "https://trivia-bck.herokuapp.com/api/games/", true);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + access_token);
    httpRequest.send();
}

function createGameRequest(httpRequest) {
    let newGameName = document.getElementById("id-new-game-name");
    let newGameQuestionTime = document.getElementById("id-new-game-question-time");
    let newGameAnswerTime = document.getElementById("id-new-game-answer-time");

    let access_token = localStorage.getItem("access_token");
    let jsonData = null;

    if (isValidToken(access_token) == false) {
        return null;
    }
    jsonData = JSON.stringify({"name" : newGameName.value,
                               "question_time" : newGameQuestionTime.value,
                               "answer_time" : newGameAnswerTime.value});
    
    httpRequest.onreadystatechange = createGameResponse;
    httpRequest.open("POST", "https://trivia-bck.herokuapp.com/api/games/", true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + access_token);
    httpRequest.send(jsonData);
}

function refreshTokenRequest(httpRequest) {
    let refresh_token = localStorage.getItem("refresh_token");
    let jsonData = null;

    if (isValidToken(refresh_token) == false) { 
        return null;
    }

    jsonData = JSON.stringify({"refresh" : refresh_token});
    
    httpRequest.onreadystatechange = refreshTokenResponse;
    httpRequest.open("POST", "https://trivia-bck.herokuapp.com/api/token/refresh/", true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(jsonData);
}

function joinGameRequest(httpRequest, gameId) {
    let access_token = localStorage.getItem("access_token");

    if (isValidToken(access_token) == false) { 
        return null;
    }

    httpRequest.onreadystatechange = joinGameResponse;
    httpRequest.open("POST", `https://trivia-bck.herokuapp.com/api/games/${gameId}/join_game/`, true);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + access_token);
    httpRequest.send();
}

function loadAllGamesResponse() {
    httpRequest = this;
    let allGamesNode = document.getElementById("show-all-games");

    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        console.log(httpRequest.status);
        console.log(httpRequest.statusText);
        if (httpRequest.status === 200) {
            console.log("load games data");
            let allGamesData = JSON.parse(httpRequest.responseText);
            for (gameData in allGamesData) {
                let selectedGameData = allGamesData[gameData];
                let newGame = new Game(selectedGameData.id,
                                        selectedGameData.creator,
                                        selectedGameData.created,
                                        selectedGameData.player_count,
                                        selectedGameData.name,
                                        selectedGameData.question_time,
                                        selectedGameData.answer_time,
                                        selectedGameData.rounds_number,
                                        selectedGameData.started,
                                        selectedGameData.ended,
                                        selectedGameData.players);
                allGamesNode.appendChild(newGame.createGameNode());
            }
        }
        else if (httpRequest.status === 401) {
            console.log(JSON.parse(httpRequest.responseText));
            let errorCode = JSON.parse(httpRequest.responseText)["code"];
            if (errorCode == "token_not_valid") {
                refreshTokenRequest(httpRequest);
            }
        }
        else {
            console.log("Something went wrong");
            console.log(httpRequest.responseText);
        }
    } else {
        console.log("Prossecing request");
    }
}

function createGameResponse() {
    httpRequest = this;
    try {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            console.log(httpRequest.status);
            console.log(httpRequest.statusText);
            if (httpRequest.status === 200) {
                console.log(httpRequest.responseText);
                location.reload();
            }
            else if (httpRequest.status === 401) {
                console.log(JSON.parse(httpRequest.responseText));
                let errorCode = JSON.parse(httpRequest.responseText)["code"];
                if (errorCode == "token_not_valid") {
                    refreshTokenRequest(httpRequest);
                }
            }
            else {
                console.log("Something went wrong");
                console.log(httpRequest.responseText);
            }              
        } else {
            console.log("Prossecing request");
        }
    }
    catch (e) {
        console.log(`Caught Exception: ${e.description}`);
    }
}

function refreshTokenResponse() {
    httpRequest = this;
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        console.log(httpRequest.status);
        console.log(httpRequest.statusText);
        if (httpRequest.status === 200) {
            let loginJWTTokens = JSON.parse(httpRequest.responseText);
            localStorage.setItem("access_token", loginJWTTokens["access"]);
            location.reload();
        } else {
            console.log("Something went wrong");
        }
        console.log(httpRequest.responseText);    
    } else {
        console.log("Prossecing request");
    }
}

function joinGameResponse() {
    httpRequest = this;
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        console.log(httpRequest.status);
        console.log(httpRequest.statusText);
        if (httpRequest.status === 200) {
            console.log(httpRequest.responseText);
            location.reload();
        } else {
            console.log("Something went wrong");
        }
        console.log(httpRequest.responseText);    
    } else {
        console.log("Prossecing request");
    }
}

function isValidToken(access_token) {
    if (access_token == null) {
        console.log("access_token does not exist");
        return false;
    }
    else if (access_token == "") {
        console.log("access_token does not exist");
        return false;
    }

    return true;
}

window.onload = function pageonLoad() {
    console.log("loaded games-backend.js");
    let createGameButton = document.getElementById("create-game-button");
    let httpRequest = new XMLHttpRequest();

    // Show Games Request
    loadAllGamesRequest(httpRequest);

    // Create Game Request
    createGameButton.addEventListener("click", function (e) {
        createGameRequest(httpRequest);
    });
}
