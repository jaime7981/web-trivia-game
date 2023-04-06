

window.onload = function pageonLoad() {
    console.log("loaded register-backend.js");
    let loginButton = document.getElementById("login-button");
    let showFormErrors = document.getElementById("show-form-errors");
    let username = document.getElementById("id_username");
    let password = document.getElementById("id_password");
    let httpRequest = new XMLHttpRequest();

    loginButton.addEventListener("click", function (e) {
        // Prepare form data
        formData = new FormData();
        formData.append("username", "G12_" + username.value);
        formData.append("password", password.value);

        httpRequest.open("POST", "https://trivia-bck.herokuapp.com/api/token/", true);
        httpRequest.send(formData);
    });
    httpRequest.onreadystatechange = () => {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                console.log(httpRequest.status);
                console.log(httpRequest.statusText);
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                    window.location = "./show_create_game.html";
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
