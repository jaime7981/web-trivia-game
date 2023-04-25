import { Game } from "./modules/game.js";
import { GameAPI } from "./modules/game-api.js";
import { Player } from "./modules/player.js";

let gameApi = new GameAPI();

async function loadAllGamesRequest() {
    await gameApi.getAllGames()
    .then(gamesData => {
        let allGamesNode = document.getElementById("show-all-games");
        for (let gamePosition = 0; gamePosition < gamesData.length; gamePosition++) {
            let selectedGameData = gamesData[gamePosition];
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
    });
}

function loadCreatedAndJoinedGames(loggedUser) {
    let createdGames = loggedUser.gamesCreated;
    let joinedGames = loggedUser.gamesJoined;

    let createdGamesNode = document.getElementById("show-created-games");
    for (let gamePosition = 0; gamePosition < createdGames.length; gamePosition ++) {
        let selectedGameData = createdGames[gamePosition];
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
        createdGamesNode.appendChild(newGame.createGameNode(true));
    }

    let joinedGamesNode = document.getElementById("show-joined-games");
    for (let gamePosition = 0; gamePosition < joinedGames.length; gamePosition ++) {
        let selectedGameData = joinedGames[gamePosition];
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
        joinedGamesNode.appendChild(newGame.createGameNode(true));
    }
}

function createGameButton() {
    let createGameButton = document.getElementById("create-game-button");
    let newGameName = document.getElementById("id-new-game-name");
    let newGameQuestionTime = document.getElementById("id-new-game-question-time");
    let newGameAnswerTime = document.getElementById("id-new-game-answer-time");

    createGameButton.addEventListener("click", function (e) {
        gameApi.createGameRequest(newGameName.value, newGameQuestionTime.value, newGameAnswerTime.value);
    });
}

window.onload = function pageonLoad() {
    gameApi.getLoggedUser()
    .then(loggedUser => {
        // console.log(loggedUser);
        loadCreatedAndJoinedGames(loggedUser);
    });
    loadAllGamesRequest();
    createGameButton();
}
