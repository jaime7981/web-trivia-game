
window.onload = function pageonLoad() {
    console.log("loaded register-backend.js");
    let httpRequest = new XMLHttpRequest();
    let refresh_token = localStorage.getItem("refresh_token");
    
    if (refresh_token == null) {
        console.log("refresh_token does not exist");
        return false;
    }
    else if (refresh_token == "") {
        console.log("refresh_token does not exist");
        return false;
    }

    let jsonData = JSON.stringify({"token_refresh" : refresh_token});
    
    httpRequest.open("POST", "https://trivia-bck.herokuapp.com/api/token/refresh/", true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(jsonData);

    httpRequest.onreadystatechange = () => {
        try {
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
                    while (showFormErrors.firstChild) {
                        showFormErrors.removeChild(showFormErrors.firstChild);
                    }
                    let errorNode = document.createElement("p");
                    errorNode.innerHTML = httpRequest.status + ": " + httpRequest.statusText;
                    showFormErrors.appendChild(errorNode);
                }              
            } else {
                console.log("Prossecing request");
            }
        }
        catch (e) {
            console.log(`Caught Exception: ${e.description}`);
            let errorNode = document.createElement("p");
            errorNode.innerHTML = e.description;
            showFormErrors.appendChild(errorNode);
        }  
    };
}
