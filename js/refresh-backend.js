
window.onload = function pageonLoad() {
    let httpRequest = new XMLHttpRequest();
    let refresh_token = localStorage.getItem("refresh_token");
    let jsonData = null;
    
    if (refresh_token == null) {
        console.log("refresh_token does not exist");
        return false;
    }
    else if (refresh_token == "") {
        console.log("refresh_token does not exist");
        return false;
    }

    jsonData = JSON.stringify({"token_refresh" : refresh_token});
    
    httpRequest.onreadystatechange = updateToken;
    httpRequest.open("POST", "https://trivia-bck.herokuapp.com/api/token/refresh/", true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(jsonData);

    function updateToken() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            console.log(httpRequest.status);
            console.log(httpRequest.statusText);
            if (httpRequest.status === 200) {
                let loginJWTTokens = JSON.parse(httpRequest.responseText);
                console.log(loginJWTTokens);
                console.log(loginJWTTokens["refresh"]);
                console.log(loginJWTTokens["access"]);
            } else {
                console.log("Something went wrong");
            }
            console.log(httpRequest.responseText);    
        } else {
            console.log("Prossecing request");
        }
    }
}
