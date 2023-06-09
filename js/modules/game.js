import { GameAPI as gameApiClass} from "./game-api.js";

export class Game {
    constructor(id, creator, created, player_count, name, question_time, answer_time, rounds_number, started, ended, players = []) {
        this.id = id;
        this.creator = creator;
        this.created = new Date(created).toLocaleDateString();
        this.player_count = player_count;
        this.name = name;
        this.question_time = question_time;
        this.answer_time = answer_time;
        this.rounds_number = rounds_number;
        this.started = started;
        this.ended = ended;
        this.players = players;
        this.gameApi = new gameApiClass();
    }
}

Game.prototype.createGameNode = function(playerinGame = false) {
    if (this.players === undefined) {
        this.players = [];
    }
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
      playerNode.textContent = `${player.username}`;  // (${player.id})`;
      playersNode.appendChild(playerNode);
    }
  
    const idNode = document.createElement('span');
    idNode.textContent = `ID: ${this.id}`;
    gameNode.appendChild(idNode);
  
    const creatorNode = document.createElement('span');
    // this.creator is a dict with keys id and username
    creatorNode.textContent = `Creator: ${this.creator.username}`;  // (${this.creator.id})`;
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
    let gameObject = this;

    for (const player of this.players) {
        if (player.id == userId) {
            playerinGame = true;
        }
    }

    if (this.started == null && gameCreatorID == userId) {
        const deleteGameButtonNode = document.createElement('button');
        deleteGameButtonNode.addEventListener("click", function (e) {
            gameObject.gameApi.deleteGameRequest(gameId);
        });
        deleteGameButtonNode.textContent = "DELETE GAME";
        gameNode.appendChild(deleteGameButtonNode);
    }

    if (this.started == null && gameCreatorID != userId && playerinGame === false) {
        const joinButtonNode = document.createElement('button');
        joinButtonNode.addEventListener("click", function (e) {
            gameObject.gameApi.joinGameRequest(gameId);
        });
        joinButtonNode.textContent = "JOIN GAME";
        gameNode.appendChild(joinButtonNode);
    }
    
    if (playerinGame === true || gameCreatorID == userId) {
        const startGameButtonNode = document.createElement('button');
        startGameButtonNode.addEventListener("click", function (e) {
            gameObject.gameApi.enterGame(gameId);
        }, false);
        startGameButtonNode.textContent = "ENTER GAME";
        gameNode.appendChild(startGameButtonNode);
    }

    if (this.started == null && playerinGame == true && gameCreatorID != userId) {
        // in_game = true;
        const leaveButtonNode = document.createElement('button');
        leaveButtonNode.addEventListener("click", function (e) {
            gameObject.gameApi.leaveGameRequest(gameId);
        });
        leaveButtonNode.textContent = "LEAVE GAME";
        gameNode.appendChild(leaveButtonNode);
    }

    return gameNode;
};