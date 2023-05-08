import { Player, createPlayerStatusList } from "./player.js";

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
    timerDiv.className = 'timer-block';
    sectionCenter[0].appendChild(timerDiv);

    let timeLeft = 59; // question_time -1

    if (socket.game != null) {
        timeLeft = socket.game.question_time;
    }

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

export async function sendAnswer(socket) {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    let headerName = document.createElement("h2");
    headerName.textContent = "Send Answer";
    sectionCenter[0].appendChild(headerName);

    // Create a div for the timer
    let timerDiv = document.createElement('div');
    timerDiv.className = 'timer-block';
    sectionCenter[0].appendChild(timerDiv);

    let timeLeft = 59; // answer_time -1

    if (socket.game != null) {
        timeLeft = socket.game.answer_time;
    }

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

    // AI API One Help
    let showHelp = document.createElement("p");
    let recived_help_api_one = await fetchApiOneHelp(socket.triviaGame.question).then(recived_help => {
        showHelp.innerHTML = recived_help;
        answerBlock.appendChild(showHelp);
    });

    let showHelpTwo = document.createElement("p");
    let recived_help_api_two = await fetchApiTwoHelp(socket.triviaGame.question).then(recived_help => {
        showHelpTwo.innerHTML = recived_help;
        answerBlock.appendChild(showHelpTwo);
    });

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
        
        if (this.triviaGame.nosyId == this.loggedUser.id) {
            // Nosy Section
            playerStartGameInfo.innerHTML = "Waiting for users to send and review answers or until time ends";
            playerBlock.appendChild(playerStartGameInfo);
        }
        else {
            // Player Section
            playerStartGameInfo.innerHTML = "Waiting for nosy to review the answers";
            playerBlock.appendChild(playerStartGameInfo);
        }    
        sectionCenter[0].appendChild(playerBlock);
    }.bind(socket), false);
}

async function fetchApiOneHelp(triviaQuestion) {
    const url = 'https://simple-chatgpt-api.p.rapidapi.com/ask';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '',
            'X-RapidAPI-Host': 'simple-chatgpt-api.p.rapidapi.com'
        },
        body: {
            question: triviaQuestion
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        return 'Error: API One failed to fetch help';
    }
}

async function fetchApiTwoHelp(triviaQuestion) {
    const url = 'https://iamai.p.rapidapi.com/ask';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Forwarded-For': '<user\'s ip>',
            'X-RapidAPI-Key': '',
            'X-RapidAPI-Host': 'iamai.p.rapidapi.com'
        },
        body: {
            consent: true,
            ip: '::1',
            question: triviaQuestion
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        return 'Error: API One failed to fetch help';
    }
}

// Load one answer
export function LoadRecivedAnswer(socket, player, answer) {
    // cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    let answersEvaluation = document.createElement("div");
    answersEvaluation.className = 'review-answers-block';

    // Player info
    let playerName = document.createElement("p");
    playerName.textContent = player.username;
    answersEvaluation.appendChild(playerName);
    
    let playerAnswer = document.createElement("p");
    playerAnswer.textContent = answer;
    answersEvaluation.appendChild(playerAnswer);

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
    answersEvaluation.appendChild(answerPoints);

    let rateAnswersButton = document.createElement("button");
    rateAnswersButton.innerHTML = "Send Rating";

    rateAnswersButton.addEventListener("click", function (e) {
        let qualification_value = answerPoints.value;
        this.sendQualification(player.id, qualification_value);
    }.bind(socket), false);

    answersEvaluation.appendChild(rateAnswersButton);

    sectionCenter[0].appendChild(answersEvaluation);
    return true;
}

// Load review
export function LoadRecivedReview(socket, correctAnswer, gradedAnswer, grade) {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    // Section Title
    let headerName = document.createElement("h2");
    headerName.textContent = "Review Answer";
    sectionCenter[0].appendChild(headerName);

    // Timer
    let timerDiv = document.createElement('div');
    timerDiv.className = 'timer-block';
    sectionCenter[0].appendChild(timerDiv);

    let timeLeft = 29; // answer_time -1

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

    // Review Answer Block
    let answersEvaluation = document.createElement("div");
    answersEvaluation.className = 'review-answers-block';

    // Correct Answer
    let correctAnswerNode = document.createElement("p");
    correctAnswerNode.textContent = correctAnswer;
    correctAnswerNode.className = 'review-correct-answer';
    answersEvaluation.appendChild(correctAnswerNode);
    
    // Graded Answer
    let gradedAnswerNode = document.createElement("p");
    gradedAnswerNode.textContent = gradedAnswer;
    gradedAnswerNode.className = 'review-graded-answer';
    answersEvaluation.appendChild(gradedAnswerNode);

    // Grade
    let gradedNode = document.createElement("p");
    gradedNode.textContent = grade;
    gradedNode.className = 'review-graded-answer';
    answersEvaluation.appendChild(gradedNode);

    // Answers Evaluation
    let correctButton = document.createElement("button");
    correctButton.className = 'review-correct-answer-button';
    let wrongButton = document.createElement("button");
    wrongButton.className = 'review-graded-answer-button';

    // correctButton.innerHTML = "true";
    // wrongButton.innerHTML = "false";

    correctButton.addEventListener("click", function (e) {
        // Send true
        this.sendEvaluation(true);
    }.bind(socket), false);

    wrongButton.addEventListener("click", function (e) {
        // Send false
        this.sendEvaluation(false);
    }.bind(socket), false);

    answersEvaluation.appendChild(correctButton);
    answersEvaluation.appendChild(wrongButton);

    sectionCenter[0].appendChild(answersEvaluation);
    return true;
}

// GameCanceled
export function GameCanceled() {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    // Section Title
    let headerName = document.createElement("h2");
    headerName.textContent = "Game Canceled";
    sectionCenter[0].appendChild(headerName);

    return true;
}

// User Disqualified
export function YouDisqualified() {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    // Section Title
    let headerName = document.createElement("h2");
    headerName.textContent = "You are disqualified";
    sectionCenter[0].appendChild(headerName);

    return true;
}

// Game Result
export function GameResult() {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    // Section Title
    let headerName = document.createElement("h2");
    headerName.textContent = "Game Ended";
    sectionCenter[0].appendChild(headerName);

    return true;
}

// Nosy Wait Review
export function NosyWaitReview() {
    cleanSectionCenterContent();
    let sectionCenter = document.getElementsByClassName("section-center");

    // Section Title
    let headerName = document.createElement("h2");
    headerName.textContent = "Waiting Review";
    sectionCenter[0].appendChild(headerName);

    // Timer
    let timerDiv = document.createElement('div');
    timerDiv.className = 'timer-block';
    sectionCenter[0].appendChild(timerDiv);

    let timeLeft = 29; // answer_time -1

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

    // Correct Answer
    let info = document.createElement("p");
    info.textContent = 'Waiting for the users to review their answers or for time to end';
    sectionCenter[0].appendChild(info);

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

    let rateReviewButton = document.createElement("button");
    rateReviewButton.innerHTML = "Review Answer";
    asideLeftBlock[0].appendChild(rateReviewButton);

    let playerListButton = document.createElement("button");
    playerListButton.innerHTML = "Players List";
    asideLeftBlock[0].appendChild(playerListButton);

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
        let players = [new Player(1, 'jaime'), new Player(2, 'jullian'), new Player(3, 'pedro')];
        LoadRecivedAnswer(null, players[0], 'answer');
    })

    rateReviewButton.addEventListener("click", function (e) {
        LoadRecivedReview(socket, 'good', 'graded', 2);
    })

    playerListButton.addEventListener("click", function (e) {
        let players = [new Player(1, 'jaime'), new Player(2, 'jullian'), new Player(3, 'pedro')];
        createPlayerStatusList(players);
    })
}