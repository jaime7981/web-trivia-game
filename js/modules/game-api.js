import { Player } from "./player.js";

export class GameAPI {
    constructor() {
        
    }

    isValidToken(access_token) {
        if (access_token == null || access_token == "") {
            console.log("access_token does not exist");
            return false;
        }
    
        return true;
    }

    async refreshToken(access_token) {
        if (this.isValidToken(access_token) == false) { 
            window.location = "./login.html";
        }

        let refresh_token = localStorage.getItem("refresh_token");
        let refreshOptions = {
            method: 'POST',
            headers: new Headers({'content-type': 'application/json'}),
            mode: 'cors'
        };

        refreshOptions.body = JSON.stringify({"refresh" : refresh_token});
    
        try {
            await fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', refreshOptions)
            .then(resp => resp.json())
            .then(json => {
                localStorage.setItem("access_token", json["access"]);
            });
        }
        catch (e) {
            console.error("Error:", e);
        }
    }

    async sendRequest(url, method = "GET", body = {}) {
        let access_token = localStorage.getItem("access_token");

        if (this.isValidToken(access_token) == false) { 
            return null;
        }

        const options = {
            method: method,
            headers: new Headers({'content-type': 'application/json',
                                Authorization: `Bearer ${access_token}`}),
            mode: 'cors'
        };

        if (method != "GET") {
            options.body = JSON.stringify(body);
        }
    
        const response = await fetch(url, options);
        console.log(response.status);

        if (response.status == 401) {
            await this.refreshToken(access_token);
            // .then(await this.sendRequest(url, method, body));
            return "expired or invalid token";
        }
        else if (response.status == 500) {
            return "internal server error";
        }
        
        const result = await response.json();
        return result;
    }

    async joinGameRequest(gameId) {
        this.sendRequest(`https://trivia-bck.herokuapp.com/api/games/${gameId}/join_game/`, "POST")
        .then(response => {
            this.enterGame(gameId);
        });
    }
    
    async deleteGameRequest(gameId) {
        await this.sendRequest(`https://trivia-bck.herokuapp.com/api/games/${gameId}/`, "DELETE");
    }

    async leaveGameRequest(gameId) {
        await this.sendRequest(`https://trivia-bck.herokuapp.com/api/games/${gameId}/unjoin_game/`, "POST");
    }

    enterGame(gameId) {
        window.location.href = `./trivia.html?gameId=${gameId}`;
    }

    async getLoggedUser() {
        let player = await this.sendRequest("https://trivia-bck.herokuapp.com/api/profile/");
        localStorage.setItem("user_id", player.id);
        let newPlayer = new Player(player.id,
                                   player.username,
                                   player.games_joined,
                                   player.games_created);
        return newPlayer;
    }

    async createGameRequest(name, questionTime, answerTime) {
        let gameData = {
            "name" : "G12_" + name,
            "question_time" : questionTime,
            "answer_time" : answerTime
        };
        await this.sendRequest("https://trivia-bck.herokuapp.com/api/games/", "POST", gameData)
        .then(createGameRequest => {
            console.log(createGameRequest);
            this.enterGame(createGameRequest.id);
        });
    }

    async getAllGames() {
        return await this.sendRequest("https://trivia-bck.herokuapp.com/api/games/");
    }
}