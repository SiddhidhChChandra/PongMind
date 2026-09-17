const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Physical HTML scoreboard
const playerScoreElement = document.getElementById("playerScore");
const opponentScoreElement = document.getElementById("opponentScore");

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
    velocityY: 0
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

    if (player.x < 0) {
        player.x = 0;
    }

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
    if (event.pointerType === "mouse") {
        mouseDragging = false;
    }
});

window.addEventListener("blur", function() {
    mouseDragging = false;
});

// Move the player with keyboard controls
function updatePlayer() {
    if (leftPressed) {
        player.x -= player.speed;
    }

    if (rightPressed) {
        player.x += player.speed;
    }

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Calculate how unpredictable the AI becomes during a long rally.
function updateAIUnpredictability() {
    const unpredictability = Math.min(rallyTime / 18, 1);

    // Early rally: almost no error.
    // Later rally: the AI increasingly misjudges the target position.
    const maximumError = 75;

    if (performance.now() >= nextAiErrorUpdate) {
        aiTargetError = (Math.random() * 2 - 1) * maximumError * unpredictability;
        nextAiErrorUpdate = performance.now() + 220;
    }
}

// Move the opponent smoothly toward an increasingly imperfect target
function updateOpponent() {
    if (ball.velocityY < 0) {
        updateAIUnpredictability();

        const targetX = ball.x - opponent.width / 2 + aiTargetError;
        const difference = targetX - opponent.x;

        let movement = difference * opponent.reaction;

        if (movement > opponent.speed) {
            movement = opponent.speed;
        }

        if (movement < -opponent.speed) {
            movement = -opponent.speed;
        }

        opponent.x += movement;
    }

    if (opponent.x < 0) {
        opponent.x = 0;
    }

    if (opponent.x + opponent.width > canvas.width) {
        opponent.x = canvas.width - opponent.width;
    }
}

// Return the current speed of the ball.
// The ball starts slow and continuously accelerates during the rally.
function getCurrentBallSpeed() {
    return Math.min(
        startingBallSpeed + rallyTime * speedIncreasePerSecond,
        maximumBallSpeed
    );
}

// Launch the ball with a controlled angle.
function launchBall(direction) {
    const speed = startingBallSpeed;
    const angle = Math.random() * 0.55 - 0.275;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = Math.sin(angle) * speed;
    ball.velocityY = direction * Math.cos(angle) * speed;

    rallyStartTime = performance.now();
    rallyTime = 0;
    aiTargetError = 0;
    nextAiErrorUpdate = performance.now() + 1000;
}

// Reset the ball and paddles after a point
function resetBall(direction) {
    player.x = canvas.width / 2 - player.width / 2;
    opponent.x = canvas.width / 2 - opponent.width / 2;
    launchBall(direction);
}

// Apply a little more unpredictability to the ball after a paddle hit.
// The randomness starts tiny and grows as the rally gets longer.
function applyRallyUnpredictability(direction) {
    const unpredictability = Math.min(rallyTime / 18, 1);
    const maximumAngleChange = 0.28;
    const randomAngleChange =
        (Math.random() * 2 - 1) * maximumAngleChange * unpredictability;

    const currentSpeed = getCurrentBallSpeed();
    const currentAngle = Math.atan2(
        ball.velocityX,
        Math.abs(ball.velocityY)
    );

    const newAngle = currentAngle + randomAngleChange;

    ball.velocityX = Math.sin(newAngle) * currentSpeed;
    ball.velocityY = direction * Math.cos(newAngle) * currentSpeed;
}

// Register a point and check for a winner
function scorePoint(playerWon) {
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
        return;
    }

    if (playerWon) {
        resetBall(1);
    } else {
        resetBall(-1);
    }
}

// Update the physical HTML scoreboard
function updateScoreboard() {
    playerScoreElement.textContent = playerScore;
    opponentScoreElement.textContent = opponentScore;
}

// Update the ball position and handle collisions
function updateBall() {
    if (gameOver) {
        return;
    }

    rallyTime = (performance.now() - rallyStartTime) / 1000;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Bounce off left and right walls.
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

    // Player paddle edges
    const playerLeft = player.x;
    const playerRight = player.x + player.width;
    const playerTop = player.y;
    const playerBottom = player.y + player.height;

    // Player paddle collision
    if (
        ballBottom >= playerTop &&
        ballTop <= playerBottom &&
        ballRight >= playerLeft &&
        ballLeft <= playerRight &&
        ball.velocityY > 0
    ) {
        const hitPosition =
            (ball.x - (player.x + player.width / 2)) /
            (player.width / 2);

        const currentSpeed = getCurrentBallSpeed();
        const baseAngle = hitPosition * 1.0;
        const unpredictability = Math.min(rallyTime / 18, 1);
        const randomAngle =
            (Math.random() * 2 - 1) * 0.28 * unpredictability;
        const finalAngle = baseAngle + randomAngle;

        ball.velocityX = Math.sin(finalAngle) * currentSpeed;
        ball.velocityY = -Math.cos(finalAngle) * currentSpeed;

        ball.y = playerTop - ball.size / 2;
    }

    // Opponent paddle edges
    const opponentLeft = opponent.x;
    const opponentRight = opponent.x + opponent.width;
    const opponentTop = opponent.y;
    const opponentBottom = opponent.y + opponent.height;

    // Opponent paddle collision
    if (
        ballTop <= opponentBottom &&
        ballBottom >= opponentTop &&
        ballRight >= opponentLeft &&
        ballLeft <= opponentRight &&
        ball.velocityY < 0
    ) {
        const hitPosition =
            (ball.x - (opponent.x + opponent.width / 2)) /
            (opponent.width / 2);

        const currentSpeed = getCurrentBallSpeed();
        const baseAngle = hitPosition * 1.0;
        const unpredictability = Math.min(rallyTime / 18, 1);
        const randomAngle =
            (Math.random() * 2 - 1) * 0.28 * unpredictability;
        const finalAngle = baseAngle + randomAngle;

        ball.velocityX = Math.sin(finalAngle) * currentSpeed;
        ball.velocityY = Math.cos(finalAngle) * currentSpeed;

        ball.y = opponentBottom + ball.size / 2;
    }

    // Player loses if the ball passes the bottom edge
    if (ballTop > canvas.height) {
        scorePoint(false);
    }

    // Opponent loses if the ball passes the top edge
    if (ballBottom < 0) {
        scorePoint(true);
    }
}

// Restart the complete match
function restartGame() {
    playerScore = 0;
    opponentScore = 0;
    gameOver = false;
    updateScoreboard();
    resetBall(-1);
}

// Draw the player paddle
function drawPlayer() {
    ctx.fillStyle = "#00A8FF";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw the opponent paddle
function drawOpponent() {
    ctx.fillStyle = "#FF4D6D";
    ctx.fillRect(opponent.x, opponent.y, opponent.width, opponent.height);
}

// Draw the ball as a circle
function drawBall() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Draw game-over message
function drawGameOver() {
    if (!gameOver) {
        return;
    }

    const playerWon = playerScore >= winningScore;
    const message = playerWon ? "YOU WIN!" : "AI WINS!";

    ctx.fillStyle = "white";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 15);

    ctx.font = "18px Arial";
    ctx.fillText("Press SPACE to restart", canvas.width / 2, canvas.height / 2 + 25);
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateOpponent();
    updateBall();

    drawPlayer();
    drawOpponent();
    drawBall();
    drawGameOver();

    requestAnimationFrame(gameLoop);
}

updateScoreboard();
launchBall(-1);
gameLoop();
