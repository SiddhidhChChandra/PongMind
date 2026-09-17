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
    x: canvas.width / 2 - (100 / 2),
    y: 20,
    width: 100,
    height: 10,
    speed: 5
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 12,
    velocityX: 5,
    velocityY: -3
};

// Keyboard controls
let leftPressed = false;
let rightPressed = false;

// Detect keyboard key press
// A / Left Arrow = move left
// D / Right Arrow = move right
document.addEventListener("keydown", function(event) {

    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
        leftPressed = true;
    }

    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
        rightPressed = true;
    }
});

// Detect keyboard key release
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

    // Center the paddle on the pointer
    player.x = pointerX - player.width / 2;

    // Keep paddle inside the canvas
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Mouse control: paddle follows ONLY while left mouse button is held and dragged
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
    // Mouse moves the paddle only during left-click drag
    if (event.pointerType === "mouse" && mouseDragging) {
        movePaddleToPointer(event.clientX);
    }

    // Touch follows the finger
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

// Stop mouse dragging if the pointer leaves the browser window
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

    // Keep paddle inside the canvas
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Move the opponent toward the ball
function updateOpponent() {

    if (ball.x < opponent.x) {
        opponent.x -= opponent.speed;
    }

    if (ball.x > opponent.x + opponent.width) {
        opponent.x += opponent.speed;
    }

    // Keep opponent paddle inside the canvas
    if (opponent.x < 0) {
        opponent.x = 0;
    }

    if (opponent.x + opponent.width > canvas.width) {
        opponent.x = canvas.width - opponent.width;
    }
}

// Update the ball position and handle collisions
function updateBall() {
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
        ball.velocityY = -ball.velocityY;

        // Move the ball just above the paddle to prevent repeated collision
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
        ball.velocityY = -ball.velocityY;

        // Move the ball just below the paddle to prevent repeated collision
        ball.y = opponentBottom + ball.size / 2;
    }
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

// Draw the ball
function drawBall() {

    ctx.fillStyle = "white";

    ctx.fillRect(
        ball.x - ball.size / 2,
        ball.y - ball.size / 2,
        ball.size,
        ball.size
    );
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

    requestAnimationFrame(gameLoop);
}

gameLoop();
