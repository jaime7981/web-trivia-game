
window.addEventListener("load", function (e) {
    console.log("loaded DOM")
    let gamesButton = document.getElementById("games-button");
    let logoutButton = document.getElementById("logout-button");
    let loginButton = document.getElementById("login-button");
    let registerButton = document.getElementById("register-button");

    let access_token = localStorage.getItem("access_token");

    // Hacer proceso inverso (agregar al DOM)
    if (access_token != null) {
        loginButton.remove();
        registerButton.remove();
    }
    else {
        gamesButton.remove();
        logoutButton.remove();
    }

    logoutButton.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("logged out");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");
        window.location = "./login.html";
    });
}, false);
