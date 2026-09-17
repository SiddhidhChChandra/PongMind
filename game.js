const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
    speed: 8,
    reaction: 0.14
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 14,
    velocityX: 0,
    velocityY: 0
};

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

    // Restart after a game over
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

    // Touch / finger-follow control
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

// Move the opponent smoothly toward the ball
function updateOpponent() {
    if (ball.velocityY < 0) {
        const targetX = ball.x - opponent.width / 2;
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

// Launch the ball with a controlled random angle
function launchBall(direction) {
    const speed = 7.5;
    const angle = Math.random() * 0.8 - 0.4;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = Math.sin(angle) * speed;
    ball.velocityY = direction * Math.cos(angle) * speed;
}

// Reset the ball after a point
function resetBall(direction) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    player.x = canvas.width / 2 - player.width / 2;
    opponent.x = canvas.width / 2 - opponent.width / 2;

    launchBall(direction);
}

// Register a point and check for a winner
function scorePoint(playerWon) {
    if (playerWon) {
        playerScore++;
    } else {
        opponentScore++;
    }

    if (playerScore >= winningScore || opponentScore >= winningScore) {
        gameOver = true;
        ball.velocityX = 0;
        ball.velocityY = 0;
        return;
    }

    // If the player scored, launch toward the player.
    // If the opponent scored, launch toward the opponent.
    if (playerWon) {
        resetBall(1);
    } else {
        resetBall(-1);
    }
}

// Update the ball position and handle collisions
function updateBall() {
    if (gameOver) {
        return;
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Bounce off the left and right walls
    if (ball.x - ball.size / 2 <= 0 || ball.x + ball.size / 2 >= canvas.width) {
        ball.velocityX = -ball.velocityX;
    }

    // Ball edges
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

        ball.velocityX = hitPosition * 6.5;

        if (Math.abs(ball.velocityX) < 1.5) {
            ball.velocityX = ball.velocityX >= 0 ? 1.5 : -1.5;
        }

        ball.velocityY = -Math.abs(ball.velocityY);
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

        ball.velocityX = hitPosition * 6.5;

        if (Math.abs(ball.velocityX) < 1.5) {
            ball.velocityX = ball.velocityX >= 0 ? 1.5 : -1.5;
        }

        ball.velocityY = Math.abs(ball.velocityY);
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
    resetBall(-1);
}

// Draw the player paddle
function drawPlayer() {
    ctx.fillStyle = "#00A8FF";
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}

// Draw the opponent paddle
function drawOpponent() {
    ctx.fillStyle = "#FF4D6D";
    ctx.fillRect(
        opponent.x,
        opponent.y,
        opponent.width,
        opponent.height
    );
}

// Draw the ball as a circle
function drawBall() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.size / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Draw the score
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(`AI  ${opponentScore}`, canvas.width / 2 - 90, 65);
    ctx.fillText(`YOU  ${playerScore}`, canvas.width / 2 + 90, 65);
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

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateOpponent();
    updateBall();

    drawPlayer();
    drawOpponent();
    drawBall();
    drawScore();
    drawGameOver();

    requestAnimationFrame(gameLoop);
}

// Start the first rally
launchBall(-1);
gameLoop();
