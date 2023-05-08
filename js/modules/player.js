
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
        this.playerKO = false;
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

    let gameStatusList = document.createElement("div");
    gameStatusList.className = "players-status-aside";

    // Table Header Names
    let header_list = ['ID', 'Name', 'Nosy', 'Status', 'Score', 'Faults', 'KO'];
    let headerNames = document.createElement("div");
    headerNames.className = 'player-status-header'
    for (let i = 0; i < header_list.length; i++) {
        let header_name_col = document.createElement('p');
        header_name_col.innerHTML = header_list[i];
        headerNames.appendChild(header_name_col);
    }

    gameStatusList.appendChild(headerNames);

    playerList.forEach(player => {
        let playerContent = document.createElement("div");
        playerContent.className = 'player-content-row';

        // Player ID
        let playerId = document.createElement("p");
        playerId.textContent = player.id;
        playerContent.appendChild(playerId);

        // Player Name
        let playerName = document.createElement("p");
        playerName.textContent = player.username;
        playerContent.appendChild(playerName);

        // Player is Nosy
        let playerPregunton = document.createElement("p");
        playerPregunton.textContent = player.isNosy;
        playerContent.appendChild(playerPregunton);

        // Player Status
        let playerStatus = document.createElement("p");
        playerStatus.textContent = player.status;
        playerContent.appendChild(playerStatus);

        // Player Score
        let playerScore = document.createElement("p");
        playerScore.textContent = player.playerScore;
        playerContent.appendChild(playerScore);

        // Player Fauls?
        let playerFaults = document.createElement("p");
        playerFaults.textContent = player.playerFaults;
        playerContent.appendChild(playerFaults);

        // Player KO?
        let playerKO = document.createElement("p");
        playerKO.textContent = player.playerKO;
        playerContent.appendChild(playerKO);

        gameStatusList.appendChild(playerContent);
    });
    asideRight[0].appendChild(gameStatusList);

    return true;
}
