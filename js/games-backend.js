
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
      playerNode.textContent = `${player.username} (${player.id})`;
      playersNode.appendChild(playerNode);
    }
  
    const idNode = document.createElement('span');
    idNode.textContent = `ID: ${this.id}`;
    gameNode.appendChild(idNode);
  
    const creatorNode = document.createElement('span');
    // this.creator is a dict with keys id and username
    creatorNode.textContent = `Creator: ${this.creator.username} (${this.creator.id})`;
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

    const gameId = this.id;
    const gameName = this.name;
    const gameCreatorID = this.creator.id;
    const userId = localStorage.getItem("user_id");
    let playerinGame = false;

    for (const player of this.players) {
        if (player.id == userId) {
            playerinGame = true;
        }
    }

    if (this.started == null && gameCreatorID == userId) {
        const startGameButtonNode = document.createElement('button');
        startGameButtonNode.addEventListener("click", function (e) {
            // TODO
            // startGameRequest(httpRequest, gameId);
            console.log("start game");
        });
        startGameButtonNode.textContent = "START GAME";
        gameNode.appendChild(startGameButtonNode);

        const deleteGameButtonNode = document.createElement('button');
        deleteGameButtonNode.addEventListener("click", function (e) {
            deleteGameRequest(httpRequest, gameId);
        });
        deleteGameButtonNode.textContent = "DELETE GAME";
        gameNode.appendChild(deleteGameButtonNode);
    }

    if (this.started == null && gameCreatorID != userId && playerinGame == false) {
        const joinButtonNode = document.createElement('button');
        joinButtonNode.addEventListener("click", function (e) {
            joinGameRequest(httpRequest, gameId);
        });
        joinButtonNode.textContent = "JOIN GAME";
        gameNode.appendChild(joinButtonNode);
    }

    if (this.started == null && playerinGame == true && gameCreatorID != userId) {
        in_game = true;
        const leaveButtonNode = document.createElement('button');
        leaveButtonNode.addEventListener("click", function (e) {
            // TODO
            // leaveGameRequest(httpRequest, gameId);
            console.log("leave game");
        });
        leaveButtonNode.textContent = "LEAVE GAME";
        gameNode.appendChild(leaveButtonNode);
    }

    return gameNode;
};

function getUserIdRequest(httpRequestId) {
    let access_token = localStorage.getItem("access_token");

    if (isValidToken(access_token) == false) {
        return null;
    }
    
    httpRequestId.onreadystatechange = getUserIdResponse;
    httpRequestId.open("GET", "https://trivia-bck.herokuapp.com/api/profile/", true);
    httpRequestId.setRequestHeader('Authorization', 'Bearer ' + access_token);
    httpRequestId.send();
}

function getUserIdResponse() {
    httpRequestId = this;

    if (httpRequestId.readyState === XMLHttpRequest.DONE) {
        console.log(httpRequestId.status);
        console.log(httpRequestId.statusText);
        if (httpRequestId.status === 200) {
            console.log("get user data");
            let userData = JSON.parse(httpRequestId.responseText);
            localStorage.setItem("user_id", userData.id);
        }
        else if (httpRequestId.status === 401) {
            console.log(JSON.parse(httpRequestId.responseText));
            let errorCode = JSON.parse(httpRequestId.responseText)["code"];
            if (errorCode == "token_not_valid") {
                refreshTokenRequest(httpRequestId);
            }
        }
        else {
            console.log("Something went wrong");
            console.log(httpRequestId.responseText);
        }
    } else {
        console.log("Prossecing request");
    }
}

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
    jsonData = JSON.stringify({"name" : "G12_" + newGameName.value,
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

function deleteGameRequest(httpRequest, gameId) {
    let access_token = localStorage.getItem("access_token");

    if (isValidToken(access_token) == false) { 
        return null;
    }

    httpRequest.onreadystatechange = deleteGameResponse;
    httpRequest.open("DELETE", `https://trivia-bck.herokuapp.com/api/games/${gameId}/`, true);
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
                location.reload();
            }
            else if (httpRequest.status === 201) {
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
            }
            console.log(httpRequest.responseText);           
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

function deleteGameResponse() {
    httpRequest = this;
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        console.log(httpRequest.status);
        console.log(httpRequest.statusText);
        if (httpRequest.status === 200) {
            console.log(httpRequest.responseText);
            location.reload();
        }
        else if (httpRequest.status === 204) {
            location.reload();
        }
        else {
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

    // GET USER ID
    let httpRequestId = new XMLHttpRequest();
    getUserIdRequest(httpRequestId);

    // GET ALL GAMES
    let createGameButton = document.getElementById("create-game-button");
    let httpRequest = new XMLHttpRequest();

    // Show Games Request
    loadAllGamesRequest(httpRequest);

    // Create Game Request
    createGameButton.addEventListener("click", function (e) {
        createGameRequest(httpRequest);
    });
}
