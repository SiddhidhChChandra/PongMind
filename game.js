const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const homeScreen = document.getElementById("homeScreen");
const menuScreen = document.getElementById("menuScreen");
const difficultyScreen = document.getElementById("difficultyScreen");
const gameScreen = document.getElementById("gameScreen");
const startGameButton = document.getElementById("startGameButton");
const difficultyButton = document.getElementById("difficultyButton");
const endlessButton = document.getElementById("endlessButton");
const matchPointsElement = document.getElementById("matchPoints");
const difficultyChoices = document.querySelectorAll(".difficulty-choice");
const savedDifficultyElement = document.getElementById("savedDifficulty");
const difficultyDescription = document.getElementById("difficultyDescription");
const saveModal = document.getElementById("saveModal");
const saveTitle = document.getElementById("saveTitle");
const playNowButton = document.getElementById("playNowButton");
const saveLaterButton = document.getElementById("saveLaterButton");
const backHomeButton = document.getElementById("backHomeButton");
const backMenuButton = document.getElementById("backMenuButton");
const pauseButton = document.getElementById("pauseButton");
const pauseOverlay = document.getElementById("pauseOverlay");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
const exitButton = document.getElementById("exitButton");
const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const gameSubtitleElement = document.getElementById("gameSubtitle");

const playerScoreElement = document.getElementById("playerScore");
const opponentScoreElement = document.getElementById("opponentScore");
const scoreStatusElement = document.getElementById("scoreStatus");
const scoreFlashElement = document.getElementById("scoreFlash");
const gameAnnouncementElement = document.getElementById("gameAnnouncement");

const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 10,
    speed: 14
};

const opponent = {
    x: canvas.width / 2 - 50,
    y: 20,
    width: 100,
    height: 10,
    speed: 9,
    reaction: 0.13
};

const difficultySettings = {
    easy: { speed: 6, reaction: 0.08, maximumError: 95 },
    normal: { speed: 9, reaction: 0.13, maximumError: 75 },
    hard: { speed: 12, reaction: 0.18, maximumError: 50 },
    extreme: { speed: 15, reaction: 0.24, maximumError: 25 }
};

let currentDifficulty = localStorage.getItem("pongmindDifficulty") || "normal";
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 14,
    velocityX: 0,
    velocityY: 0,
    visible: false
};

const startingBallSpeed = 4.2;
const maximumBallSpeed = 13.5;
const speedIncreasePerSecond = 0.42;

let rallyStartTime = 0;
let rallyTime = 0;
let aiTargetError = 0;
let nextAiErrorUpdate = 0;

let playerScore = 0;
let opponentScore = 0;
let winningScore = 5;

let gameOver = false;
let gameStarted = false;
let isEndlessMode = false;
let endlessStartTime = 0;
const endlessDuration = 10 * 60 * 1000;

let transitionActive = false;
let transitionPhase = "none";
let transitionStartTime = 0;

const startIntroDuration = 1400;
const scoreDuration = 1000;
const readyDuration = 2000;
const goDuration = 1000;

let leftPressed = false;
let rightPressed = false;
let mouseDragging = false;
let isPaused = false;
let pendingDifficulty = currentDifficulty;

function showScreen(screenToShow) {
    [homeScreen, menuScreen, difficultyScreen, gameScreen].forEach(screen => {
        screen.classList.toggle("hidden", screen !== screenToShow);
    });
}

function updateSavedDifficultyUI() {
    savedDifficultyElement.textContent = "DIFFICULTY: " + currentDifficulty.toUpperCase();
}

const difficultyDescriptions = {
    easy: "A gentle fight. Learn the rhythm and keep the ball alive.",
    normal: "A steady fight. Good place to learn the rhythm.",
    hard: "Quick reactions. The machine leaves less room for mistakes.",
    extreme: "No mercy. Fast reactions and sharp returns."
};

function openDifficultyPage() {
    pendingDifficulty = currentDifficulty;
    difficultyChoices.forEach(button => {
        button.classList.toggle("selected", button.dataset.difficulty === pendingDifficulty);
    });
    difficultyDescription.textContent = difficultyDescriptions[pendingDifficulty];
    showScreen(difficultyScreen);
}

function openDifficultyModal(difficulty) {
    pendingDifficulty = difficulty;
    saveTitle.textContent = difficulty.toUpperCase() + " SELECTED";
    saveModal.classList.add("open");
}

function applyDifficulty(difficulty) {
    setDifficulty(difficulty);
    localStorage.setItem("pongmindDifficulty", difficulty);
    updateSavedDifficultyUI();
}

homeScreen.addEventListener("click", function() {
    showScreen(menuScreen);
});

difficultyButton.addEventListener("click", function(event) {
    event.stopPropagation();
    openDifficultyPage();
});

difficultyChoices.forEach(button => {
    button.addEventListener("click", function(event) {
        event.stopPropagation();
        difficultyChoices.forEach(item => item.classList.remove("selected"));
        button.classList.add("selected");
        difficultyDescription.textContent = difficultyDescriptions[button.dataset.difficulty];
        openDifficultyModal(button.dataset.difficulty);
    });
});

playNowButton.addEventListener("click", function() {
    applyDifficulty(pendingDifficulty);
    saveModal.classList.remove("open");
    startConfiguredGame();
});

saveLaterButton.addEventListener("click", function() {
    applyDifficulty(pendingDifficulty);
    saveModal.classList.remove("open");
    showScreen(menuScreen);
});

backHomeButton.addEventListener("click", function() {
    showScreen(homeScreen);
});

backMenuButton.addEventListener("click", function() {
    showScreen(menuScreen);
});

startGameButton.addEventListener("click", function(event) {
    event.stopPropagation();
    winningScore = Number(matchPointsElement.value);
    startConfiguredGame();
});

endlessButton.addEventListener("click", function(event) {
    event.stopPropagation();
    startEndlessMode();
});

document.addEventListener("keydown", function(event) {
    if (gameScreen.classList.contains("hidden")) return;

    if (!gameStarted && (event.key === " " || event.key === "Enter")) {
        startConfiguredGame();
        return;
    }

    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") leftPressed = true;
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") rightPressed = true;

    if (event.key === " " && gameOver) restartGame();
});

document.addEventListener("keyup", function(event) {
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") leftPressed = false;
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") rightPressed = false;
});

function movePaddleToPointer(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const pointerX = (clientX - rect.left) * scaleX;

    player.x = pointerX - player.width / 2;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

canvas.addEventListener("pointerdown", function(event) {
    if (!gameStarted || gameOver || isPaused) return;

    if (event.pointerType === "mouse" && event.button === 0) {
        mouseDragging = true;
        canvas.setPointerCapture(event.pointerId);
        movePaddleToPointer(event.clientX);
    }

    if (event.pointerType === "touch") {
        event.preventDefault();
        movePaddleToPointer(event.clientX);
    }
});

canvas.addEventListener("pointermove", function(event) {
    if (event.pointerType === "mouse" && mouseDragging) {
        movePaddleToPointer(event.clientX);
    }

    if (event.pointerType === "touch") {
        event.preventDefault();
        movePaddleToPointer(event.clientX);
    }
});

canvas.addEventListener("pointerup", function(event) {
    if (event.pointerType === "mouse" && event.button === 0) {
        mouseDragging = false;
    }
});

canvas.addEventListener("pointercancel", function(event) {
    if (event.pointerType === "mouse") mouseDragging = false;
});

window.addEventListener("blur", function() {
    mouseDragging = false;
    leftPressed = false;
    rightPressed = false;
});

function updatePlayer() {
    if (!gameStarted || transitionActive || gameOver || isPaused) return;

    if (leftPressed) player.x -= player.speed;
    if (rightPressed) player.x += player.speed;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function updateAIUnpredictability() {
    const unpredictability = Math.min(rallyTime / 18, 1);
    const maximumError = difficultySettings[currentDifficulty].maximumError;

    if (performance.now() >= nextAiErrorUpdate) {
        aiTargetError = (Math.random() * 2 - 1) * maximumError * unpredictability;
        nextAiErrorUpdate = performance.now() + 220;
    }
}

function updateOpponent() {
    if (!gameStarted || transitionActive || gameOver || isPaused) return;

    if (ball.velocityY < 0) {
        updateAIUnpredictability();

        const settings = difficultySettings[currentDifficulty];
        const targetX = ball.x - opponent.width / 2 + aiTargetError;
        const difference = targetX - opponent.x;

        let movement = difference * settings.reaction;

        if (movement > settings.speed) movement = settings.speed;
        if (movement < -settings.speed) movement = -settings.speed;

        opponent.x += movement;
    }

    if (opponent.x < 0) opponent.x = 0;
    if (opponent.x + opponent.width > canvas.width) {
        opponent.x = canvas.width - opponent.width;
    }
}

function setDifficulty(difficulty) {
    if (!difficultySettings[difficulty]) return;

    currentDifficulty = difficulty;
    const settings = difficultySettings[difficulty];

    opponent.speed = settings.speed;
    opponent.reaction = settings.reaction;
}

function getCurrentBallSpeed() {
    return Math.min(startingBallSpeed + rallyTime * speedIncreasePerSecond, maximumBallSpeed);
}

function launchBall() {
    const speed = startingBallSpeed;
    const angle = Math.random() * 0.55 - 0.275;
    const direction = Math.random() < 0.5 ? -1 : 1;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = Math.sin(angle) * speed;
    ball.velocityY = direction * Math.cos(angle) * speed;
    ball.visible = true;

    rallyStartTime = performance.now();
    rallyTime = 0;
    aiTargetError = 0;
    nextAiErrorUpdate = performance.now() + 1000;
}

function beginMatch(introText) {
    gameStarted = true;
    gameOver = false;
    isPaused = false;
    pauseOverlay.classList.remove("open");
    transitionActive = true;
    transitionPhase = "start-intro";
    transitionStartTime = performance.now();

    playerScore = 0;
    opponentScore = 0;

    ball.visible = false;
    player.x = canvas.width / 2 - player.width / 2;
    opponent.x = canvas.width / 2 - opponent.width / 2;

    scoreFlashElement.classList.remove("ai", "player");
    scoreStatusElement.textContent = "";
    updateScoreboard();

    showAnnouncement(introText, "#FFFFFF", "show-score");
}

function startConfiguredGame() {
    isEndlessMode = false;
    winningScore = Number(matchPointsElement.value);

    gameSubtitleElement.textContent =
        currentDifficulty.toUpperCase() + " • FIRST TO " + winningScore + " WINS";

    showScreen(gameScreen);
    beginMatch("FIRST TO " + winningScore + " WINS");
}

function startEndlessMode() {
    isEndlessMode = true;
    winningScore = Infinity;
    endlessStartTime = performance.now();

    gameSubtitleElement.textContent =
        currentDifficulty.toUpperCase() + " • ENDLESS MODE • 10:00";

    showScreen(gameScreen);
    beginMatch("HIGHEST SCORE IN 10 MINUTES WINS");
    endlessStartTime = performance.now();
}

function resetBallAfterScore() {
    player.x = canvas.width / 2 - player.width / 2;
    opponent.x = canvas.width / 2 - opponent.width / 2;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = 0;
    ball.velocityY = 0;
    ball.visible = false;

    transitionActive = true;
    transitionPhase = "score";
    transitionStartTime = performance.now();
}

function showAnnouncement(text, color, animationClass) {
    gameAnnouncementElement.classList.remove("show-score", "show-ready", "show-go");
    void gameAnnouncementElement.offsetWidth;

    gameAnnouncementElement.textContent = text;
    gameAnnouncementElement.style.color = color;
    gameAnnouncementElement.classList.add(animationClass);
}

function updateTransition() {
    if (!transitionActive || gameOver) return;

    const elapsed = performance.now() - transitionStartTime;

    if (transitionPhase === "start-intro" && elapsed >= startIntroDuration) {
        transitionPhase = "ready";
        transitionStartTime = performance.now();
        showAnnouncement("READY!", "#FFFFFF", "show-ready");
        return;
    }

    if (transitionPhase === "score" && elapsed >= scoreDuration) {
        transitionPhase = "ready";
        transitionStartTime = performance.now();
        showAnnouncement("READY!", "#FFFFFF", "show-ready");
        return;
    }

    if (transitionPhase === "ready" && elapsed >= readyDuration) {
        transitionPhase = "go";
        transitionStartTime = performance.now();
        showAnnouncement("GO!", "#FFFFFF", "show-go");
        return;
    }

    if (transitionPhase === "go" && elapsed >= goDuration) {
        transitionActive = false;
        transitionPhase = "none";

        gameAnnouncementElement.classList.remove("show-go");
        gameAnnouncementElement.textContent = "";
        scoreStatusElement.textContent = "";

        player.x = canvas.width / 2 - player.width / 2;
        opponent.x = canvas.width / 2 - opponent.width / 2;

        launchBall();
    }
}

function triggerScoreSequence(playerWon) {
    const winnerClass = playerWon ? "player" : "ai";
    const winnerText = playerWon ? "PLAYER SCORED!" : "AI SCORED!";
    const winnerColor = playerWon ? "#00A8FF" : "#FF4D6D";

    scoreFlashElement.classList.remove("ai", "player");
    void scoreFlashElement.offsetWidth;
    scoreFlashElement.classList.add(winnerClass);

    showAnnouncement(winnerText, winnerColor, "show-score");
    scoreStatusElement.textContent = "";
}

function animateScoreNumber(element) {
    element.classList.remove("score-changing");
    void element.offsetWidth;
    element.classList.add("score-changing");
}

function finishEndlessMode() {
    gameOver = true;
    transitionActive = false;
    ball.velocityX = 0;
    ball.velocityY = 0;
    ball.visible = false;

    let winnerText = "DRAW!";
    let winnerColor = "#FFFFFF";

    if (playerScore > opponentScore) {
        winnerText = "YOU WIN!";
        winnerColor = "#FFD45C";
    } else if (opponentScore > playerScore) {
        winnerText = "AI WINS!";
        winnerColor = "#FF6A35";
    }

    scoreFlashElement.classList.remove("ai", "player");
    void scoreFlashElement.offsetWidth;

    if (playerScore > opponentScore) scoreFlashElement.classList.add("player");
    if (opponentScore > playerScore) scoreFlashElement.classList.add("ai");

    showAnnouncement(winnerText, winnerColor, "show-ready");
    scoreStatusElement.textContent =
        "10 MINUTES COMPLETE • FINAL SCORE " + playerScore + " : " + opponentScore;
}

function scorePoint(playerWon) {
    if (transitionActive || gameOver) return;

    if (playerWon) playerScore++;
    else opponentScore++;

    updateScoreboard(playerWon ? "player" : "ai");

    if (isEndlessMode) {
        resetBallAfterScore();
        triggerScoreSequence(playerWon);
        return;
    }

    if (playerScore >= winningScore || opponentScore >= winningScore) {
        gameOver = true;
        ball.velocityX = 0;
        ball.velocityY = 0;
        ball.visible = false;

        const winnerText = playerWon ? "YOU WIN!" : "AI WINS!";
        const winnerColor = playerWon ? "#00A8FF" : "#FF4D6D";

        scoreFlashElement.classList.remove("ai", "player");
        void scoreFlashElement.offsetWidth;
        scoreFlashElement.classList.add(playerWon ? "player" : "ai");

        showAnnouncement(winnerText, winnerColor, "show-ready");
        scoreStatusElement.textContent = "PRESS SPACE TO PLAY AGAIN";
        return;
    }

    resetBallAfterScore();
    triggerScoreSequence(playerWon);
}

function updateScoreboard(changedSide) {
    playerScoreElement.textContent = playerScore;
    opponentScoreElement.textContent = opponentScore;

    if (changedSide === "player") animateScoreNumber(playerScoreElement);
    if (changedSide === "ai") animateScoreNumber(opponentScoreElement);
}

function updateEndlessTimer() {
    if (!isEndlessMode || !gameStarted || gameOver) return;

    const elapsed = performance.now() - endlessStartTime;
    const remaining = Math.max(0, endlessDuration - elapsed);
    const totalSeconds = Math.ceil(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    scoreStatusElement.textContent =
        "ENDLESS • " + minutes + ":" + String(seconds).padStart(2, "0");

    if (remaining <= 0) {
        finishEndlessMode();
    }
}

function updateBall() {
    if (!gameStarted || gameOver || transitionActive || !ball.visible || isPaused) return;

    rallyTime = (performance.now() - rallyStartTime) / 1000;

    const currentSpeed = getCurrentBallSpeed();
    const currentMagnitude = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);

    if (currentMagnitude > 0) {
        const speedScale = currentSpeed / currentMagnitude;
        ball.velocityX *= speedScale;
        ball.velocityY *= speedScale;
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.x - ball.size / 2 <= 0 || ball.x + ball.size / 2 >= canvas.width) {
        ball.velocityX = -ball.velocityX;
        ball.x = Math.max(
            ball.size / 2,
            Math.min(canvas.width - ball.size / 2, ball.x)
        );
    }

    const ballLeft = ball.x - ball.size / 2;
    const ballRight = ball.x + ball.size / 2;
    const ballTop = ball.y - ball.size / 2;
    const ballBottom = ball.y + ball.size / 2;

    if (
        ballBottom >= player.y &&
        ballTop <= player.y + player.height &&
        ballRight >= player.x &&
        ballLeft <= player.x + player.width &&
        ball.velocityY > 0
    ) {
        const hitPosition =
            (ball.x - (player.x + player.width / 2)) / (player.width / 2);

        const unpredictability = Math.min(rallyTime / 18, 1);
        const difficultyAngleMultiplier =
            currentDifficulty === "extreme" ? 0.12 : 0.28;

        const randomAngle =
            (Math.random() * 2 - 1) *
            difficultyAngleMultiplier *
            unpredictability;

        const finalAngle = hitPosition + randomAngle;

        ball.velocityX = Math.sin(finalAngle) * currentSpeed;
        ball.velocityY = -Math.cos(finalAngle) * currentSpeed;
        ball.y = player.y - ball.size / 2;
    }

    if (
        ballTop <= opponent.y + opponent.height &&
        ballBottom >= opponent.y &&
        ballRight >= opponent.x &&
        ballLeft <= opponent.x + opponent.width &&
        ball.velocityY < 0
    ) {
        const hitPosition =
            (ball.x - (opponent.x + opponent.width / 2)) /
            (opponent.width / 2);

        const unpredictability = Math.min(rallyTime / 18, 1);
        const difficultyAngleMultiplier =
            currentDifficulty === "extreme" ? 0.12 : 0.28;

        const randomAngle =
            (Math.random() * 2 - 1) *
            difficultyAngleMultiplier *
            unpredictability;

        const finalAngle = hitPosition + randomAngle;

        ball.velocityX = Math.sin(finalAngle) * currentSpeed;
        ball.velocityY = Math.cos(finalAngle) * currentSpeed;
        ball.y = opponent.y + opponent.height + ball.size / 2;
    }

    if (ballTop > canvas.height) scorePoint(false);
    if (ballBottom < 0) scorePoint(true);
}

function drawRoundedPaddle(paddle, glowColor) {
    if (transitionActive || gameOver || !gameStarted) return;

    ctx.save();
    ctx.fillStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18;

    ctx.beginPath();
    ctx.roundRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height,
        paddle.height / 2
    );
    ctx.fill();

    ctx.restore();
}

function drawPlayer() {
    drawRoundedPaddle(player, "#FFD45C");
}

function drawOpponent() {
    drawRoundedPaddle(opponent, "#FF6A35");
}

function drawBall() {
    if (!ball.visible || transitionActive || gameOver || !gameStarted) return;

    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "#FFFFFF";
    ctx.shadowBlur = 18;

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function restartGame() {
    if (isEndlessMode) {
        startEndlessMode();
        return;
    }
    winningScore = Number(matchPointsElement.value);
    startConfiguredGame();
}

function togglePause() {
    if (!gameStarted || gameOver) return;
    isPaused = !isPaused;
    pauseOverlay.classList.toggle("open", isPaused);
}

function exitMatch() {
    isPaused = false;
    gameStarted = false;
    gameOver = false;
    transitionActive = false;
    ball.visible = false;
    pauseOverlay.classList.remove("open");
    confirmModal.classList.remove("open");
    showScreen(menuScreen);
    updateSavedDifficultyUI();
}

pauseButton.addEventListener("click", togglePause);
resumeButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", function() {
    pauseOverlay.classList.remove("open");
    isPaused = false;
    restartGame();
});
exitButton.addEventListener("click", function() {
    pauseOverlay.classList.remove("open");
    confirmModal.classList.add("open");
});
confirmNo.addEventListener("click", function() {
    confirmModal.classList.remove("open");
    pauseOverlay.classList.add("open");
    isPaused = true;
});
confirmYes.addEventListener("click", exitMatch);

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !gameScreen.classList.contains("hidden")) {
        event.preventDefault();
        togglePause();
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateOpponent();
    updateBall();
    updateTransition();
    updateEndlessTimer();

    drawPlayer();
    drawOpponent();
    drawBall();

    requestAnimationFrame(gameLoop);
}

setDifficulty(currentDifficulty);
updateSavedDifficultyUI();
updateScoreboard();
gameLoop();