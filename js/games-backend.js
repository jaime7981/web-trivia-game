import { Game } from "./modules/game.js";
import { GameAPI } from "./modules/game-api.js";
import { Player } from "./modules/player.js";

let gameApi = new GameAPI();

async function getUserIdRequest() {
    let player = await gameApi.sendRequest("https://trivia-bck.herokuapp.com/api/profile/");
    localStorage.setItem("user_id", player.id);
    let newPlayer = new Player(player.id,
                               player.username,
                               player.games_created,
                               player.games_joined);
    console.log(newPlayer);
}

async function loadAllGamesRequest() {
    let allGamesData = await gameApi.sendRequest("https://trivia-bck.herokuapp.com/api/games/");
    let allGamesNode = document.getElementById("show-all-games");
    for (let gamePosition = 0; gamePosition < allGamesData.length; gamePosition++) {
        let selectedGameData = allGamesData[gamePosition];
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

async function createGameRequest() {
    let newGameName = document.getElementById("id-new-game-name");
    let newGameQuestionTime = document.getElementById("id-new-game-question-time");
    let newGameAnswerTime = document.getElementById("id-new-game-answer-time");

    let gameData = {
        "name" : "G12_" + newGameName.value,
        "question_time" : newGameQuestionTime.value,
        "answer_time" : newGameAnswerTime.value
    };

    await gameApi.sendRequest("https://trivia-bck.herokuapp.com/api/games/", "POST", gameData);
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
    getUserIdRequest();

    // GET ALL GAMES
    loadAllGamesRequest();

    // Create Game Request
    let createGameButton = document.getElementById("create-game-button");
    createGameButton.addEventListener("click", function (e) {
        createGameRequest();
    });
}
