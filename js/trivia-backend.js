import { TriviaWebSocket } from "./modules/trivia-ws.js";
import { GameAPI } from "./modules/game-api.js";
import * as triviaViews from "./modules/trivia-views.js";

window.onload = function pageonLoad() {
    console.log("loaded trivia-backend.js");

    // Socket test
    let params = new URLSearchParams(location.search);
    let socket = new TriviaWebSocket(params.get('gameId'));
    socket.loadWebSocketEventlisteners();

    // Fetch API Test
    let gameApi = new GameAPI();
    gameApi.getLoggedUser()
    .then(loggedUser => {
        socket.loggedUser = loggedUser;
    })
    gameApi.getAllGames()
    .then(allGames => {
        for (let i = 0; i < allGames.length; i ++) {
            if (allGames[i].id == params.get('gameId')) {
                socket.game = allGames[i];
                break;
            }
        }
    });

    // Start Game Button
    triviaViews.loadStartGame(socket);

    // Buttons for Debuging
    triviaViews.loadAsideDebugButtons(socket);
}
