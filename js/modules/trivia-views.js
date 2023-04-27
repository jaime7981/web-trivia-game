export function cleanSectionCenterContent() {
    let sectionCenter = document.getElementsByClassName("section-center");

    while (sectionCenter[0].firstChild) {
        sectionCenter[0].removeChild(sectionCenter[0].firstChild);
    }
}

export function loadStartGame(socket) {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    let headerName = document.createElement("h2");
    headerName.textContent = "Start Game";
    sectionCenter[0].appendChild(headerName);

    // Creator Question
    let creatorBlock = document.createElement("div");
    creatorBlock.className = "creator-block";

    let setGameRounds = document.createElement("input");
    setGameRounds.type = "text";
    setGameRounds.placeholder = "rounds";

    let startGameButton = document.createElement("button");
    startGameButton.innerHTML = "Start Game";

    if (socket.game == null) {
        let playerBlock = document.createElement("div");
        playerBlock.className = "player-block";

        let playerStartGameInfo = document.createElement("p");
        playerStartGameInfo.innerHTML = "Game already started or you got disconnected\nNext round could refresh your state";
        
        playerBlock.appendChild(playerStartGameInfo);
        sectionCenter[0].appendChild(playerBlock);
    }
    else if (socket.loggedUser.id == socket.game.creator.id) {
        creatorBlock.appendChild(setGameRounds);
        creatorBlock.appendChild(startGameButton);
        sectionCenter[0].appendChild(creatorBlock);
        startGameButton.addEventListener("click", function (e) {
            this.startGame(setGameRounds.value);
        }.bind(socket), false);
    }
    else {
        let playerBlock = document.createElement("div");
        playerBlock.className = "player-block";

        let playerStartGameInfo = document.createElement("p");
        playerStartGameInfo.innerHTML = "Waiting for creator to start the game";
        
        playerBlock.appendChild(playerStartGameInfo);
        sectionCenter[0].appendChild(playerBlock);
    }
}

export function askQuestion(socket) {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    if (sectionCenter[0] == null) {
        return false;
    }

    // Creator Send Question
    // TODO: if statement for nosy player
    let headerName = document.createElement("h2");
    headerName.textContent = "Send Question";
    sectionCenter[0].appendChild(headerName);

    // Create a div for the timer
    let timerDiv = document.createElement('div');
    sectionCenter[0].appendChild(timerDiv);

    let timeLeft = 59; // question_time -1

    function updateTimer() {
        timerDiv.innerHTML = 'Time left: ' + timeLeft + ' seconds';
        if (timeLeft === 0) {
            clearInterval(interval);
            timerDiv.innerHTML = 'Time out';
        } else {
            timeLeft--;
        }
    }

    const interval = setInterval(updateTimer, 1000);

    let questionDiv = document.createElement("div");
    questionDiv.className = "question-div";

    let questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.placeholder = "Question";

    let questionButton = document.createElement("button");
    questionButton.innerHTML = "Send Question";

    // Player Wait
    let playerBlock = document.createElement("div");
    playerBlock.className = "player-block";

    let playerStartGameInfo = document.createElement("p");
    playerStartGameInfo.innerHTML = "Waiting for nosy to send the question";

    // nosy or player statement
    if (socket.triviaGame.nosyId == socket.loggedUser.id) {
        questionDiv.appendChild(questionInput);
        questionDiv.appendChild(questionButton);
        sectionCenter[0].appendChild(questionDiv);
        questionButton.addEventListener("click", async function (e) {
            let question = questionInput.value;
            await this.sendQuestion(question);
            let doneMessage = document.createElement("span");
            doneMessage.textContent = "Question sent\n";
            questionDiv.appendChild(doneMessage);
        }.bind(socket), false);
    }
    else {
        playerBlock.appendChild(playerStartGameInfo);
        sectionCenter[0].appendChild(playerBlock);
    }    
    return true
}

export function sendAnswer(socket) {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    let headerName = document.createElement("h2");
    headerName.textContent = "Send Answer";
    sectionCenter[0].appendChild(headerName);

    // Create a div for the timer
    let timerDiv = document.createElement('div');
    sectionCenter[0].appendChild(timerDiv);

    let timeLeft = 59; // answer_time -1

    function updateTimer() {
        timerDiv.innerHTML = 'Time left: ' + timeLeft + ' seconds';
        if (timeLeft === 0) {
            clearInterval(interval);
            timerDiv.innerHTML = 'Time out';
        } else {
            timeLeft--;
        }
    }

    const interval = setInterval(updateTimer, 1000);


    let answerBlock = document.createElement("div");
    answerBlock.className = "answer-block";

    let showQuestion = document.createElement("p");
    showQuestion.innerHTML = "Question: " + socket.triviaGame.question;

    let setAnswer = document.createElement("input");
    setAnswer.type = "text";
    setAnswer.placeholder = "answer";

    let sendAnswerButton = document.createElement("button");
    sendAnswerButton.innerHTML = "Send Answer";

    answerBlock.appendChild(showQuestion);
    answerBlock.appendChild(setAnswer);
    answerBlock.appendChild(sendAnswerButton);
    sectionCenter[0].appendChild(answerBlock);

    sendAnswerButton.addEventListener("click", async function (e) {
        let answer = setAnswer.value;
        await this.sendAnswer(answer);
        let doneMessage = document.createElement("span");
        doneMessage.textContent = "Answer Sent\n";
        answerBlock.appendChild(doneMessage);

        let playerBlock = document.createElement("div");
        playerBlock.className = "player-block";

        let playerStartGameInfo = document.createElement("p");
        playerStartGameInfo.innerHTML = "Waiting for nosy to review the answers";
        
        playerBlock.appendChild(playerStartGameInfo);
        sectionCenter[0].appendChild(playerBlock);
    }.bind(socket), false);

    // Nosy Functionalities
    // TODO: recieve Answers, review Answers
}

export function loadRecievedAnswers(playerList) {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    if (sectionCenter[0] == null) {
        return false;
    }

    let headerName = document.createElement("h2");
    headerName.textContent = "Answers Points";
    sectionCenter[0].appendChild(headerName);

    let answersEvaluation = document.createElement("div");

    playerList.forEach(player => {
        let playerAnswersContent = document.createElement("div");

        let playerName = document.createElement("span");
        playerName.textContent = player.name;
        playerAnswersContent.appendChild(playerName);
        playerAnswersContent.appendChild(document.createTextNode(" | "));
        
        let playerAnswer = document.createElement("span");
        playerAnswer.textContent = "playerTestAnswer";
        playerAnswersContent.appendChild(playerAnswer);
        playerAnswersContent.appendChild(document.createTextNode(" | "));

        // Answers Evaluation
        let answerPoints = document.createElement("select");
        let answerPointsGood = document.createElement("option");
        let answerPointsMedium = document.createElement("option");
        let answerPointsBad = document.createElement("option");

        answerPointsGood.value = 2;
        answerPointsMedium.value = 1;
        answerPointsBad.value = 0;

        answerPointsGood.innerHTML = "good";
        answerPointsMedium.innerHTML = "medium";
        answerPointsBad.innerHTML = "bad";

        answerPoints.appendChild(answerPointsGood);
        answerPoints.appendChild(answerPointsMedium);
        answerPoints.appendChild(answerPointsBad);
        
        playerAnswersContent.appendChild(answerPoints);

        answersEvaluation.appendChild(playerAnswersContent);
    });
    sectionCenter[0].appendChild(answersEvaluation);

    let rateAnswersButton = document.createElement("button");
    rateAnswersButton.innerHTML = "Send Ratings";
    sectionCenter[0].appendChild(rateAnswersButton);

    return true;
}

export function loadAsideDebugButtons(socket) {
    let asideLeftBlock = document.getElementsByClassName("aside-left");

    let startGameButton = document.createElement("button");
    startGameButton.innerHTML = "Start Game";
    asideLeftBlock[0].appendChild(startGameButton);

    let askQuestionButton = document.createElement("button");
    askQuestionButton.innerHTML = "Ask Question";
    asideLeftBlock[0].appendChild(askQuestionButton);

    let sendAnswerButton = document.createElement("button");
    sendAnswerButton.innerHTML = "Send Answer";
    asideLeftBlock[0].appendChild(sendAnswerButton);

    let rateAnswersButton = document.createElement("button");
    rateAnswersButton.innerHTML = "Rate Answers";
    asideLeftBlock[0].appendChild(rateAnswersButton);

    startGameButton.addEventListener("click", function(e) {
        cleanSectionCenterContent();
        loadStartGame(socket);
    }, false);

    askQuestionButton.addEventListener("click", function (e) {
        cleanSectionCenterContent();
        askQuestion(socket);
    })

    sendAnswerButton.addEventListener("click", function (e) {
        cleanSectionCenterContent();
        sendAnswer(socket);
    })

    rateAnswersButton.addEventListener("click", function (e) {
        cleanSectionCenterContent();
        loadRecievedAnswers(socket.triviaGame.players);
    })
}