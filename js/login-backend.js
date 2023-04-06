
window.onload = function pageonLoad() {
    console.log("loaded register-backend.js");
    let loginButton = document.getElementById("login-button");
    let showFormErrors = document.getElementById("show-form-errors");
    let username = document.getElementById("id_username");
    let password = document.getElementById("id_password");
    let httpRequest = new XMLHttpRequest();

    loginButton.addEventListener("click", function (e) {
        // Prepare json data
        let jsonData = JSON.stringify({"username" : "G12_" + username.value,
                                       "password" : password.value});
        
        httpRequest.open("POST", "https://trivia-bck.herokuapp.com/api/token/", true);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(jsonData);
    });
    httpRequest.onreadystatechange = () => {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                console.log(httpRequest.status);
                console.log(httpRequest.statusText);
                if (httpRequest.status === 200) {
                    let loginJWTTokens = JSON.parse(httpRequest.responseText);
                    localStorage.setItem("refresh_token", loginJWTTokens["refresh"]);
                    localStorage.setItem("access_token", loginJWTTokens["access"]);
                    window.location = "./games.html";
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
