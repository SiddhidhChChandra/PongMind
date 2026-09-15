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

// Draw the player paddle
function drawPlayer() {
    ctx.fillStyle = "white";
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

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();
