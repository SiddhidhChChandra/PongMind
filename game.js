const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerScoreElement = document.getElementById("playerScore");
const opponentScoreElement = document.getElementById("opponentScore");
const scoreStatusElement = document.getElementById("scoreStatus");
const scoreFlashElement = document.getElementById("scoreFlash");
const gameAnnouncementElement = document.getElementById("gameAnnouncement");

const player = { x: canvas.width / 2 - 50, y: canvas.height - 30, width: 100, height: 10, speed: 14 };
const opponent = { x: canvas.width / 2 - 50, y: 20, width: 100, height: 10, speed: 9, reaction: 0.13 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, size: 14, velocityX: 0, velocityY: 0, visible: true };

const startingBallSpeed = 4.2;
const maximumBallSpeed = 13.5;
const speedIncreasePerSecond = 0.42;
let rallyStartTime = 0;
let rallyTime = 0;
let aiTargetError = 0;
let nextAiErrorUpdate = 0;

let playerScore = 0;
let opponentScore = 0;
const winningScore = 5;
let gameOver = false;

let transitionActive = false;
let transitionPhase = "none";
let transitionStartTime = 0;

const scoreDuration = 1000;
const readyDuration = 2000;
const goDuration = 1000;

let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", function(event) {
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
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

let mouseDragging = false;
canvas.addEventListener("pointerdown", function(event) {
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
    if (event.pointerType === "mouse" && mouseDragging) movePaddleToPointer(event.clientX);
    if (event.pointerType === "touch") { event.preventDefault(); movePaddleToPointer(event.clientX); }
});
canvas.addEventListener("pointerup", function(event) {
    if (event.pointerType === "mouse" && event.button === 0) mouseDragging = false;
});
canvas.addEventListener("pointercancel", function(event) {
    if (event.pointerType === "mouse") mouseDragging = false;
});
window.addEventListener("blur", function() { mouseDragging = false; });

function updatePlayer() {
    if (transitionActive || gameOver) return;
    if (leftPressed) player.x -= player.speed;
    if (rightPressed) player.x += player.speed;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function updateAIUnpredictability() {
    const unpredictability = Math.min(rallyTime / 18, 1);
    const maximumError = 75;
    if (performance.now() >= nextAiErrorUpdate) {
        aiTargetError = (Math.random() * 2 - 1) * maximumError * unpredictability;
        nextAiErrorUpdate = performance.now() + 220;
    }
}

function updateOpponent() {
    if (transitionActive || gameOver) return;
    if (ball.velocityY < 0) {
        updateAIUnpredictability();
        const targetX = ball.x - opponent.width / 2 + aiTargetError;
        const difference = targetX - opponent.x;
        let movement = difference * opponent.reaction;
        if (movement > opponent.speed) movement = opponent.speed;
        if (movement < -opponent.speed) movement = -opponent.speed;
        opponent.x += movement;
    }
    if (opponent.x < 0) opponent.x = 0;
    if (opponent.x + opponent.width > canvas.width) opponent.x = canvas.width - opponent.width;
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

function scorePoint(playerWon) {
    if (transitionActive || gameOver) return;
    if (playerWon) playerScore++;
    else opponentScore++;
    updateScoreboard(playerWon ? "player" : "ai");

    if (playerScore >= winningScore || opponentScore >= winningScore) {
        gameOver = true;
        ball.velocityX = 0;
        ball.velocityY = 0;
        ball.visible = false;
        const winnerText = playerWon ? "PLAYER SCORED!" : "AI SCORED!";
        const winnerColor = playerWon ? "#00A8FF" : "#FF4D6D";
        scoreFlashElement.classList.remove("ai", "player");
        void scoreFlashElement.offsetWidth;
        scoreFlashElement.classList.add(playerWon ? "player" : "ai");
        showAnnouncement(winnerText + "<br>" + (playerWon ? "YOU WIN!" : "AI WINS!"), winnerColor, "show-score");
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

function updateBall() {
    if (gameOver || transitionActive || !ball.visible) return;
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
        ball.x = Math.max(ball.size / 2, Math.min(canvas.width - ball.size / 2, ball.x));
    }

    const ballLeft = ball.x - ball.size / 2;
    const ballRight = ball.x + ball.size / 2;
    const ballTop = ball.y - ball.size / 2;
    const ballBottom = ball.y + ball.size / 2;

    if (ballBottom >= player.y && ballTop <= player.y + player.height && ballRight >= player.x && ballLeft <= player.x + player.width && ball.velocityY > 0) {
        const hitPosition = (ball.x - (player.x + player.width / 2)) / (player.width / 2);
        const unpredictability = Math.min(rallyTime / 18, 1);
        const randomAngle = (Math.random() * 2 - 1) * 0.28 * unpredictability;
        const finalAngle = hitPosition + randomAngle;
        ball.velocityX = Math.sin(finalAngle) * currentSpeed;
        ball.velocityY = -Math.cos(finalAngle) * currentSpeed;
        ball.y = player.y - ball.size / 2;
    }

    if (ballTop <= opponent.y + opponent.height && ballBottom >= opponent.y && ballRight >= opponent.x && ballLeft <= opponent.x + opponent.width && ball.velocityY < 0) {
        const hitPosition = (ball.x - (opponent.x + opponent.width / 2)) / (opponent.width / 2);
        const unpredictability = Math.min(rallyTime / 18, 1);
        const randomAngle = (Math.random() * 2 - 1) * 0.28 * unpredictability;
        const finalAngle = hitPosition + randomAngle;
        ball.velocityX = Math.sin(finalAngle) * currentSpeed;
        ball.velocityY = Math.cos(finalAngle) * currentSpeed;
        ball.y = opponent.y + opponent.height + ball.size / 2;
    }

    if (ballTop > canvas.height) scorePoint(false);
    if (ballBottom < 0) scorePoint(true);
}

function drawPlayer() {
    if (transitionActive || gameOver) return;
    ctx.fillStyle = "#00A8FF";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}
function drawOpponent() {
    if (transitionActive || gameOver) return;
    ctx.fillStyle = "#FF4D6D";
    ctx.fillRect(opponent.x, opponent.y, opponent.width, opponent.height);
}
function drawBall() {
    if (!ball.visible || transitionActive || gameOver) return;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();
}

function restartGame() {
    playerScore = 0;
    opponentScore = 0;
    gameOver = false;
    transitionActive = false;
    transitionPhase = "none";
    gameAnnouncementElement.classList.remove("show-score", "show-ready", "show-go");
    gameAnnouncementElement.textContent = "";
    scoreFlashElement.classList.remove("ai", "player");
    scoreStatusElement.textContent = "";
    updateScoreboard();
    player.x = canvas.width / 2 - player.width / 2;
    opponent.x = canvas.width / 2 - opponent.width / 2;
    launchBall();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    updateOpponent();
    updateBall();
    updateTransition();
    drawPlayer();
    drawOpponent();
    drawBall();
    requestAnimationFrame(gameLoop);
}

updateScoreboard();
scoreStatusElement.textContent = "";
launchBall();
gameLoop();