const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Physical scoreboard
const playerScoreElement = document.getElementById("playerScore");
const opponentScoreElement = document.getElementById("opponentScore");
const scoreStatusElement = document.getElementById("scoreStatus");
const scoreFlashElement = document.getElementById("scoreFlash");

// Player paddle
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 10,
    speed: 14
};

// Opponent paddle
const opponent = {
    x: canvas.width / 2 - 50,
    y: 20,
    width: 100,
    height: 10,
    speed: 9,
    reaction: 0.13
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 14,
    velocityX: 0,
    velocityY: 0,
    visible: true
};

// Ball speed progression
const startingBallSpeed = 4.2;
const maximumBallSpeed = 13.5;
const speedIncreasePerSecond = 0.42;
let rallyStartTime = 0;
let rallyTime = 0;

// Increasing unpredictability
let aiTargetError = 0;
let nextAiErrorUpdate = 0;

// Score and game state
let playerScore = 0;
let opponentScore = 0;
const winningScore = 5;
let gameOver = false;

// Post-score sequence
let transitionActive = false;
let transitionPhase = "none";
let transitionStartTime = 0;
let nextBallDirection = -1;

const scoreFlashDuration = 1000;
const readyDuration = 420;
const goDuration = 420;

// Keyboard controls
let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", function(event) {
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
        leftPressed = true;
    }

    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
        rightPressed = true;
    }

    if (event.key === " " && gameOver) {
        restartGame();
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
        leftPressed = false;
    }

    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
        rightPressed = false;
    }
});

// Convert screen pointer position to canvas position
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

// Mouse control: left-click and drag
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
});

// Move the player with keyboard controls
function updatePlayer() {
    if (transitionActive || gameOver) return;

    if (leftPressed) player.x -= player.speed;
    if (rightPressed) player.x += player.speed;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Calculate how unpredictable the AI becomes during a long rally.
function updateAIUnpredictability() {
    const unpredictability = Math.min(rallyTime / 18, 1);
    const maximumError = 75;

    if (performance.now() >= nextAiErrorUpdate) {
        aiTargetError =
            (Math.random() * 2 - 1) * maximumError * unpredictability;
        nextAiErrorUpdate = performance.now() + 220;
    }
}

// Move the opponent smoothly toward an increasingly imperfect target.
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
    if (opponent.x + opponent.width > canvas.width) {
        opponent.x = canvas.width - opponent.width;
    }
}

// Return the current ball speed.
function getCurrentBallSpeed() {
    return Math.min(
        startingBallSpeed + rallyTime * speedIncreasePerSecond,
        maximumBallSpeed
    );
}

// Launch the ball from the center with a random direction.
function launchBall(direction) {
    const speed = startingBallSpeed;
    const angle = Math.random() * 0.55 - 0.275;

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

// Prepare the next rally. The ball stays hidden during the sequence.
function resetBall(direction) {
    player.x = canvas.width / 2 - player.width / 2;
    opponent.x = canvas.width / 2 - opponent.width / 2;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = 0;
    ball.velocityY = 0;
    ball.visible = false;

    nextBallDirection = direction;
    transitionActive = true;
    transitionPhase = "score";
    transitionStartTime = performance.now();

    triggerScoreFlash(direction === 1 ? "player" : "ai");
}

// Update SCORE -> READY -> GO.
function updateTransition() {
    if (!transitionActive || gameOver) return;

    const elapsed = performance.now() - transitionStartTime;

    if (transitionPhase === "score" && elapsed >= scoreFlashDuration) {
        transitionPhase = "ready";
        transitionStartTime = performance.now();
        setStatus("READY!", "#FFFFFF");
        return;
    }

    if (transitionPhase === "ready" && elapsed >= readyDuration) {
        transitionPhase = "go";
        transitionStartTime = performance.now();
        setStatus("GO!", "#FFFFFF");
        return;
    }

    if (transitionPhase === "go" && elapsed >= goDuration) {
        transitionActive = false;
        transitionPhase = "none";
        setStatus("PLAY", "#9CA3AF");
        launchBall(nextBallDirection);
    }
}

// Put the current match state in the physical scoreboard.
function setStatus(text, color) {
    scoreStatusElement.textContent = text;
    scoreStatusElement.style.color = color;
}

// Trigger a center-out red/blue flash over the entire game area.
function triggerScoreFlash(winner) {
    scoreFlashElement.classList.remove("ai", "player");

    // Force a reflow so every score restarts the animation.
    void scoreFlashElement.offsetWidth;

    scoreFlashElement.classList.add(winner);

    if (winner === "player") {
        setStatus("PLAYER SCORED!", "#00A8FF");
    } else {
        setStatus("AI SCORED!", "#FF4D6D");
    }
}

// Register a point and begin the transition sequence.
function scorePoint(playerWon) {
    if (transitionActive || gameOver) return;

    if (playerWon) {
        playerScore++;
    } else {
        opponentScore++;
    }

    updateScoreboard();

    if (playerScore >= winningScore || opponentScore >= winningScore) {
        gameOver = true;
        ball.velocityX = 0;
        ball.velocityY = 0;
        ball.visible = false;

        if (playerWon) {
            setStatus("PLAYER SCORED! • YOU WIN!", "#00A8FF");
        } else {
            setStatus("AI SCORED! • AI WINS!", "#FF4D6D");
        }
        return;
    }

    resetBall(playerWon ? 1 : -1);
}

function updateScoreboard() {
    playerScoreElement.textContent = playerScore;
    opponentScoreElement.textContent = opponentScore;
}

// Update ball movement and collisions.
function updateBall() {
    if (gameOver || transitionActive || !ball.visible) return;

    rallyTime = (performance.now() - rallyStartTime) / 1000;

    // Continuously accelerate while the rally lasts.
    const currentSpeed = getCurrentBallSpeed();
    const currentMagnitude = Math.sqrt(
        ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY
    );

    if (currentMagnitude > 0) {
        const speedScale = currentSpeed / currentMagnitude;
        ball.velocityX *= speedScale;
        ball.velocityY *= speedScale;
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Bounce off left and right walls.
    if (
        ball.x - ball.size / 2 <= 0 ||
        ball.x + ball.size / 2 >= canvas.width
    ) {
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

    // Player paddle collision.
    if (
        ballBottom >= player.y &&
        ballTop <= player.y + player.height &&
        ballRight >= player.x &&
        ballLeft <= player.x + player.width &&
        ball.velocityY > 0
    ) {
        const hitPosition =
            (ball.x - (player.x + player.width / 2)) /
            (player.width / 2);

        const unpredictability = Math.min(rallyTime / 18, 1);
        const randomAngle =
            (Math.random() * 2 - 1) * 0.28 * unpredictability;
        const finalAngle = hitPosition * 1.0 + randomAngle;

        ball.velocityX = Math.sin(finalAngle) * currentSpeed;
        ball.velocityY = -Math.cos(finalAngle) * currentSpeed;
        ball.y = player.y - ball.size / 2;
    }

    // Opponent paddle collision.
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
        const randomAngle =
            (Math.random() * 2 - 1) * 0.28 * unpredictability;
        const finalAngle = hitPosition * 1.0 + randomAngle;

        ball.velocityX = Math.sin(finalAngle) * currentSpeed;
        ball.velocityY = Math.cos(finalAngle) * currentSpeed;
        ball.y = opponent.y + opponent.height + ball.size / 2;
    }

    // Player loses if the ball passes the bottom edge.
    if (ballTop > canvas.height) scorePoint(false);

    // AI loses if the ball passes the top edge.
    if (ballBottom < 0) scorePoint(true);
}

// Draw the player paddle.
function drawPlayer() {
    ctx.fillStyle = "#00A8FF";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw the opponent paddle.
function drawOpponent() {
    ctx.fillStyle = "#FF4D6D";
    ctx.fillRect(opponent.x, opponent.y, opponent.width, opponent.height);
}

// Draw the ball as a circle.
function drawBall() {
    if (!ball.visible) return;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Restart the complete match.
function restartGame() {
    playerScore = 0;
    opponentScore = 0;
    gameOver = false;
    transitionActive = false;
    transitionPhase = "none";
    updateScoreboard();
    setStatus("PLAY", "#9CA3AF");
    launchBall(-1);
}

// Main game loop.
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
setStatus("PLAY", "#9CA3AF");
launchBall(-1);
gameLoop();
