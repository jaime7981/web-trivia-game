
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
    
        try {
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
        catch (e) {
            console.error("Error:", e);
        }
    }
}