
export class Player {
    constructor(playerId, playerName, gamesJoined = [], gamesCreated = []) {
        // Api Values
        this.id = playerId;
        this.username = playerName;
        this.gamesJoined = gamesJoined;
        this.gamesCreated = gamesCreated;

        // Default Values
        this.status = "online";
        this.playerScore = 0;
        this.isNosy = false;
        this.playerFaults = 0;
        this.playerKO = true;
    }
}

export function createPlayerStatusList(playerList) {
    let asideRight = document.getElementsByClassName("aside-right");

    while (asideRight[0].firstChild) {
        asideRight[0].removeChild(asideRight[0].firstChild);
    }

    if (asideRight[0] == null) {
        return false;
    }
    else if (playerList.length == 0) {
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
        playerName.textContent = player.username;
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
        playerPregunton.textContent = player.isNosy;
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
