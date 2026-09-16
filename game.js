const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player paddle
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 10,
    speed: 7
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

// Mobile touch controls
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

leftButton.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    leftPressed = true;
});

rightButton.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    rightPressed = true;
});

leftButton.addEventListener("pointerup", function() {
    leftPressed = false;
});

rightButton.addEventListener("pointerup", function() {
    rightPressed = false;
});

leftButton.addEventListener("pointerleave", function() {
    leftPressed = false;
});

rightButton.addEventListener("pointerleave", function() {
    rightPressed = false;
});

// Move the player
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

// Game loop
function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();
