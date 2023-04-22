
function loadErrorBlock() {
    let sectionCenter = document.getElementsByClassName("section-center");
    let errorBlock = document.createElement("div");
    errorBlock.className = "show-errors";
    errorBlock.id = "show-form-errors";

    if (sectionCenter.length >= 1) {
        sectionCenter[0].appendChild(errorBlock);
    }
}

function createNavButton(name) {
    let refButton = document.createElement("a");
    let buttonText = document.createElement("p");
    buttonText.innerHTML = name.toUpperCase();
    refButton.href = "./" + name + ".html";
    refButton.id = name + "-button";
    refButton.className = "header-hyperlinks";
    refButton.appendChild(buttonText);
    return refButton;
}

function loadNavbarButtons() {
    let headerNav = document.getElementsByClassName("header-nav");
    let headerLoginNav = document.getElementsByClassName("header-login-register");
    let access_token = localStorage.getItem("access_token");
    
    
    if (headerNav.length >= 1 && headerLoginNav.length >= 1) {
        headerNav[0].appendChild(createNavButton("index"));
        if (access_token != null) {
            headerNav[0].appendChild(createNavButton("games"));
            headerNav[0].appendChild(createNavButton("trivia"));
            headerLoginNav[0].appendChild(createNavButton("logout"));
        }
        else {
            headerLoginNav[0].appendChild(createNavButton("login"));
            headerLoginNav[0].appendChild(createNavButton("register"));
        }
    }
}

window.addEventListener("load", function (e) {
    loadErrorBlock();
    loadNavbarButtons();
    let logoutButton = document.getElementById("logout-button");

    if (logoutButton != null) {
        logoutButton.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_id");
            window.location = "./login.html";
        });
    }
}, false);
