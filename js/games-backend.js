import { Game } from "./modules/game.js";
import { GameAPI } from "./modules/game-api.js";
import { Player } from "./modules/player.js";

let gameApi = new GameAPI();

async function getUserRequest() {
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

function createGameButton() {
    let createGameButton = document.getElementById("create-game-button");
    let newGameName = document.getElementById("id-new-game-name");
    let newGameQuestionTime = document.getElementById("id-new-game-question-time");
    let newGameAnswerTime = document.getElementById("id-new-game-answer-time");

    createGameButton.addEventListener("click", function (e) {
        createGameRequest(newGameName.value, newGameQuestionTime.value, newGameAnswerTime.value);
    });
}

async function createGameRequest(name, questionTime, answerTime) {
    let gameData = {
        "name" : "G12_" + name,
        "question_time" : questionTime,
        "answer_time" : answerTime
    };
    await gameApi.sendRequest("https://trivia-bck.herokuapp.com/api/games/", "POST", gameData);
}

window.onload = function pageonLoad() {
    getUserRequest();
    loadAllGamesRequest();
    createGameButton();
}
