
window.onload = function pageonLoad() {
    console.log("loaded register-backend.js");
    let registerButton = document.getElementById("register-button");
    let showFormErrors = document.getElementById("show-form-errors");
    let username = document.getElementById("id_username");
    let password1 = document.getElementById("id_password1");
    let password2 = document.getElementById("id_password2");
    let httpRequest = new XMLHttpRequest();

    registerButton.addEventListener("click", function (e) {
        // Prepare form data
        let formData = new FormData();
        formData.append("username", "G12_" + username.value);
        formData.append("password1", password1.value);
        formData.append("password2", password2.value);

        httpRequest.open("POST", "https://trivia-bck.herokuapp.com/registration/", true);
        httpRequest.send(formData);
    });
    httpRequest.onreadystatechange = () => {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                console.log(httpRequest.status);
                console.log(httpRequest.statusText);
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText);
                    let userExist = httpRequest.responseText.search('<ul class="errorlist"><li>A user with that username already exists.</li></ul>');
                    let unmatchedPasswords = httpRequest.responseText.search('<ul class="errorlist"><li>The two password fields didn’t match.</li></ul>');
                    let tooShortPassword = httpRequest.responseText.search('<ul class="errorlist"><li>This password is too short. It must contain at least 6 characters.</li></ul');
                    let requestErrors = [];
                    if (userExist != -1) {
                        console.log("The user already exist");
                        requestErrors.push("The user already exist");
                    }
                    if (unmatchedPasswords != -1) {
                        console.log("The passwords didn't match");
                        requestErrors.push("The passwords didn't match");
                    }
                    if (tooShortPassword != -1) {
                        console.log("The passwords are too short");
                        requestErrors.push("The passwords are too short");
                    }

                    if (requestErrors.length > 0) {
                        while (showFormErrors.firstChild) {
                            showFormErrors.removeChild(showFormErrors.firstChild);
                        }
                        let errorNode = null;
                        for (error in requestErrors) {
                            errorNode = document.createElement("p");
                            errorNode.innerHTML = requestErrors[error];
                            showFormErrors.appendChild(errorNode);
                        }
                    }
                    else {
                        console.log("User registered succesfully");
                        window.location = "./login.html";
                    }
                } else {
                    console.log("Something went wrong");
                }              
            } else {
                console.log("Prossecing request");
            }
        }
        catch (e) {
            console.log(`Caught Exception: ${e.description}`);
        }  
    };
}
