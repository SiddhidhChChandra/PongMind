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
const endScreen = document.getElementById("endScreen");
const endTitle = document.getElementById("endTitle");
const endStamp = document.getElementById("endStamp");
const endScore = document.getElementById("endScore");
const endMessage = document.getElementById("endMessage");
const endStats = document.getElementById("endStats");
const endRestartButton = document.getElementById("endRestartButton");
const endMenuButton = document.getElementById("endMenuButton");
const endDifficultyButton = document.getElementById("endDifficultyButton");

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
    easy: {
        speed: 7,
        reaction: 0.11,
        maximumError: 55,
        prediction: 0.50,
        fakeChance: 0
    },
    normal: {
        speed: 8.5,
        reaction: 0.115,
        maximumError: 75,
        prediction: 0.35,
        fakeChance: 0.02
    },
    // Hard inherits the previous Extreme baseline.
    hard: {
        speed: 18,
        reaction: 0.38,
        maximumError: 7,
        prediction: 1,
        fakeChance: 0.025
    },
    // Extreme is faster and more precise, but its deceptive movement is rarer.
    extreme: {
        speed: 21,
        reaction: 0.48,
        maximumError: 4,
        prediction: 1,
        fakeChance: 0.008
    }
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

const ballSpeedCurves = {
    easy:    [{t:0,s:2},{t:30,s:4},{t:60,s:6},{t:90,s:7},{t:120,s:8},{t:150,s:8.5},{t:180,s:9}],
    normal:  [{t:0,s:3},{t:30,s:5},{t:60,s:6.5},{t:90,s:8},{t:120,s:9},{t:150,s:10},{t:180,s:10.5}],
    hard:    [{t:0,s:4},{t:30,s:6},{t:60,s:7.5},{t:90,s:9},{t:120,s:10},{t:150,s:11},{t:180,s:12}],
    extreme: [{t:0,s:5},{t:30,s:7},{t:60,s:8},{t:90,s:9.5},{t:120,s:10.5},{t:150,s:11.5},{t:180,s:12.5}]
};
const maximumBallSpeed = 14.5;

let rallyStartTime = 0;
let rallyTime = 0;
let aiTargetError = 0;
let nextAiErrorUpdate = 0;
let aiFakeOffset = 0;
let nextAiFakeUpdate = 0;

let rallyCount = 0;
let longestRally = 0;

// Day 6 power-up state
const powerUpTypes = ["big-paddle","small-paddle","speed-boost","slow-ball","magnetic-ball","multi-ball","big-ball","small-ball","reverse-controls","screen-shake","ball-speed-up"];
const powerUpDurations = {"big-paddle":8000,"small-paddle":8000,"speed-boost":7000,"slow-ball":7000,"magnetic-ball":8000,"multi-ball":6000,"big-ball":7000,"small-ball":7000,"reverse-controls":5000,"screen-shake":4500,"ball-speed-up":5000};
const powerUpState = {active:false,type:null,x:0,y:-30,speed:70,activePickups:[]};
let activePowerUp = null;
let activePowerUps = [];
let powerUpSpawnAt = 0;
let powerUpSpawnCount = 1;
let gameOrientation = "vertical";

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
let upPressed = false;
let downPressed = false;
let mouseDragging = false;
let extraBalls = [];
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

    // Enter/Space must never accidentally activate a focused button or
    // restart the current match. Starting/restarting is done through the UI.
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        return;
    }

    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") leftPressed = true;
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") rightPressed = true;
    if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") upPressed = true;
    if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") downPressed = true;
});

document.addEventListener("keyup", function(event) {
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") leftPressed = false;
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") rightPressed = false;
    if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") upPressed = false;
    if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") downPressed = false;
});

const leftControlButton = document.getElementById("leftControlButton");
const rightControlButton = document.getElementById("rightControlButton");

function setControlButtonState(button, pressed) {
    button.classList.toggle("pressed", pressed);
}

function bindControlButton(button, direction) {
    if (!button) return;

    const press = function(event) {
        event.preventDefault();
        if (!gameStarted || gameOver || isPaused) return;
        if (direction === "left") leftPressed = true;
        if (direction === "right") rightPressed = true;
        setControlButtonState(button, true);
    };

    const release = function(event) {
        event.preventDefault();
        if (direction === "left") leftPressed = false;
        if (direction === "right") rightPressed = false;
        setControlButtonState(button, false);
    };

    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
    button.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });
}

bindControlButton(leftControlButton, "left");
bindControlButton(rightControlButton, "right");

function updateTouchControlLabels() {
    if (!leftControlButton || !rightControlButton) return;

    if (gameOrientation === "horizontal") {
        leftControlButton.textContent = "▲";
        rightControlButton.textContent = "▼";
        leftControlButton.setAttribute("aria-label", "Move up");
        rightControlButton.setAttribute("aria-label", "Move down");
    } else {
        leftControlButton.textContent = "◀";
        rightControlButton.textContent = "▶";
        leftControlButton.setAttribute("aria-label", "Move left");
        rightControlButton.setAttribute("aria-label", "Move right");
    }
}

updateTouchControlLabels();


window.addEventListener("blur", function() {
    mouseDragging = false;
    leftPressed = false;
    rightPressed = false;
    upPressed = false;
    downPressed = false;
});

function getPowerUpCount(type) {
    return activePowerUps.filter(effect => effect.type === type).length;
}

function getActivePowerUp(type) {
    return activePowerUps.find(effect => effect.type === type) || null;
}

function getPlayerLength() {
    let length = 100;
    const bigCount = getPowerUpCount("big-paddle");
    const smallCount = getPowerUpCount("small-paddle");
    if (bigCount) length *= Math.pow(1.35, bigCount);
    if (smallCount) length *= Math.pow(0.65, smallCount);
    return Math.max(35, Math.min(520, length));
}

function getPlayerSpeed() {
    return player.speed * Math.pow(1.45, getPowerUpCount("speed-boost"));
}

function updatePlayer() {
    if (!gameStarted || transitionActive || gameOver || isPaused) return;

    const length = getPlayerLength();
    const movementSpeed = getPlayerSpeed();
    const reverse = getPowerUpCount("reverse-controls") % 2 === 1;

    if (gameOrientation === "horizontal") {
        player.width = 10;
        player.height = length;
        const up = reverse ? rightPressed : leftPressed;
        const down = reverse ? leftPressed : rightPressed;
        if (up) player.y -= movementSpeed;
        if (down) player.y += movementSpeed;
        player.x = 20;
        if (player.y < 0) player.y = 0;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
        return;
    }

    player.width = length;
    player.height = 10;
    const left = reverse ? rightPressed : leftPressed;
    const right = reverse ? leftPressed : rightPressed;
    if (left) player.x -= movementSpeed;
    if (right) player.x += movementSpeed;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function getMatchPressure() {
    if (isEndlessMode || winningScore <= 0) return 0;

    const pressureStart = Math.max(1, winningScore - 2);
    const highestScore = Math.max(playerScore, opponentScore);
    if (highestScore < pressureStart) return 0;

    if (highestScore >= winningScore - 1) return 1;
    return 0.55;
}

function getDynamicAISettings() {
    const base = difficultySettings[currentDifficulty];
    const pressure = getMatchPressure();
    const fatigue = currentDifficulty === "extreme"
        ? Math.min(1, Math.max(0, (rallyTime - 90) / 120))
        : 0;

    const settings = { ...base };

    // Long Extreme rallies create controlled opportunities without turning
    // the AI into an intentionally weak opponent.
    if (fatigue > 0) {
        settings.maximumError += 7 * fatigue;
        settings.reaction *= 1 - 0.14 * fatigue;
    }

    // Match-point pressure sharpens the AI within its own difficulty.
    settings.maximumError *= 1 - 0.35 * pressure;
    settings.reaction *= 1 + 0.22 * pressure;
    settings.speed *= 1 + 0.08 * pressure;
    settings.prediction = Math.min(1, settings.prediction + (1 - settings.prediction) * 0.35 * pressure);

    return settings;
}

function updateAIUnpredictability() {
    const settings = getDynamicAISettings();
    const unpredictability = Math.min(rallyTime / 18, 1);
    const pressure = getMatchPressure();
    const now = performance.now();

    if (now >= nextAiErrorUpdate) {
        aiTargetError =
            (Math.random() * 2 - 1) *
            settings.maximumError *
            Math.max(0.35, unpredictability);

        nextAiErrorUpdate = now + (currentDifficulty === "extreme" ? 170 : 260);
    }

    if (now >= nextAiFakeUpdate) {
        aiFakeOffset = 0;

        // Fakes are deliberately rare: the goal is surprise, not a readable pattern.
        const fakeChance = settings.fakeChance * Math.max(0.5, unpredictability) * (1 - 0.35 * pressure);
        if (Math.random() < fakeChance) {
            aiFakeOffset =
                (Math.random() < 0.5 ? -1 : 1) *
                (currentDifficulty === "extreme"
                    ? 28 + Math.random() * 34
                    : 18 + Math.random() * 24);
        }

        nextAiFakeUpdate = now + (currentDifficulty === "extreme" ? 650 : 850);
    }
}

function predictBallXAtOpponent() {
    if (ball.velocityY >= 0) return ball.x;
    const distance = Math.max(0, ball.y - (opponent.y + opponent.height + ball.size / 2));
    const timeToReach = distance / Math.max(0.1, Math.abs(ball.velocityY));
    let predictedX = ball.x + ball.velocityX * timeToReach;
    const minX = ball.size / 2;
    const maxX = canvas.width - ball.size / 2;
    const width = maxX - minX;
    if (width <= 0) return ball.x;
    predictedX -= minX;
    const cycle = width * 2;
    let wrapped = ((predictedX % cycle) + cycle) % cycle;
    if (wrapped > width) wrapped = cycle - wrapped;
    return minX + wrapped;
}

function predictBallYAtOpponent() {
    if (ball.velocityX <= 0) return ball.y;
    const distance = Math.max(0, canvas.width - (opponent.x - ball.size / 2) - ball.x);
    const timeToReach = distance / Math.max(0.1, Math.abs(ball.velocityX));
    let predictedY = ball.y + ball.velocityY * timeToReach;
    const minY = ball.size / 2;
    const maxY = canvas.height - ball.size / 2;
    const height = maxY - minY;
    if (height <= 0) return ball.y;
    predictedY -= minY;
    const cycle = height * 2;
    let wrapped = ((predictedY % cycle) + cycle) % cycle;
    if (wrapped > height) wrapped = cycle - wrapped;
    return minY + wrapped;
}

function updateOpponent() {
    if (!gameStarted || transitionActive || gameOver || isPaused) return;

    const settings = getDynamicAISettings();

    if (gameOrientation === "horizontal") {
        opponent.width = 10;
        opponent.height = 100;
        opponent.x = canvas.width - 30;
        if (ball.velocityX > 0) {
            updateAIUnpredictability();
            const directTarget = ball.y;
            const predictedTarget = predictBallYAtOpponent();
            const targetY = directTarget + (predictedTarget - directTarget) * settings.prediction + aiTargetError + aiFakeOffset;
            const difference = targetY - opponent.y - opponent.height / 2;
            let movement = difference * settings.reaction;
            if (movement > settings.speed) movement = settings.speed;
            if (movement < -settings.speed) movement = -settings.speed;
            opponent.y += movement;
        } else if (currentDifficulty === "easy") {
            opponent.y += (canvas.height / 2 - (opponent.y + opponent.height / 2)) * 0.015;
        }
        opponent.y = Math.max(0, Math.min(canvas.height - opponent.height, opponent.y));
        return;
    }

    opponent.width = 100;
    opponent.height = 10;
    if (ball.velocityY < 0) {
        updateAIUnpredictability();
        const directTarget = ball.x;
        const predictedTarget = predictBallXAtOpponent();
        const targetBallX = directTarget + (predictedTarget - directTarget) * settings.prediction;
        const targetX = targetBallX - opponent.width / 2 + aiTargetError + aiFakeOffset;
        const difference = targetX - opponent.x;
        let movement = difference * settings.reaction;
        if (movement > settings.speed) movement = settings.speed;
        if (movement < -settings.speed) movement = -settings.speed;
        opponent.x += movement;
    } else if (currentDifficulty === "easy") {
        const centerDifference = canvas.width / 2 - (opponent.x + opponent.width / 2);
        opponent.x += centerDifference * 0.015;
    }
    opponent.x = Math.max(0, Math.min(canvas.width - opponent.width, opponent.x));
}

function setDifficulty(difficulty) {
    if (!difficultySettings[difficulty]) return;

    currentDifficulty = difficulty;
    const settings = difficultySettings[difficulty];

    opponent.speed = settings.speed;
    opponent.reaction = settings.reaction;
}

function getBaseBallSpeedAtTime(elapsed) {
    const curve = ballSpeedCurves[currentDifficulty] || ballSpeedCurves.normal;
    if (elapsed <= curve[0].t) return curve[0].s;

    for (let i = 1; i < curve.length; i++) {
        if (elapsed <= curve[i].t) {
            const previous = curve[i - 1];
            const current = curve[i];
            const progress = (elapsed - previous.t) / (current.t - previous.t);
            return previous.s + (current.s - previous.s) * progress;
        }
    }

    const last = curve[curve.length - 1];
    const extraTime = elapsed - last.t;
    return Math.min(maximumBallSpeed, last.s + Math.min(4, extraTime / 60));
}

function getCurrentBallSpeed() {
    let speed = getBaseBallSpeedAtTime(Math.max(0, rallyTime));
    speed *= Math.pow(0.65, getPowerUpCount("slow-ball"));
    speed *= Math.pow(1.35, getPowerUpCount("ball-speed-up"));
    return Math.min(speed, maximumBallSpeed);
}

function applyPowerUpEffects() {
    const length = getPlayerLength();
    if (gameOrientation === "horizontal") {
        player.width = 10;
        player.height = length;
        opponent.width = 10;
        opponent.height = 100;
    } else {
        player.width = length;
        player.height = 10;
        opponent.width = 100;
        opponent.height = 10;
    }
    const bigBallCount = getPowerUpCount("big-ball");
    const smallBallCount = getPowerUpCount("small-ball");
    ball.size = Math.max(5, Math.min(42, 14 * Math.pow(1.55, bigBallCount) * Math.pow(0.68, smallBallCount)));
}

function launchBall() {
    const speed = getBaseBallSpeedAtTime(0);
    const angle = Math.random() * 0.55 - 0.275;
    const direction = Math.random() < 0.5 ? -1 : 1;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    if (gameOrientation === "horizontal") {
        ball.velocityX = direction * Math.cos(angle) * speed;
        ball.velocityY = Math.sin(angle) * speed;
    } else {
        ball.velocityX = Math.sin(angle) * speed;
        ball.velocityY = direction * Math.cos(angle) * speed;
    }
    ball.visible = true;
    rallyStartTime = performance.now();
    rallyTime = 0;
    applyPowerUpEffects();
    aiTargetError = 0;
    aiFakeOffset = 0;
    nextAiErrorUpdate = performance.now() + 1000;
    nextAiFakeUpdate = performance.now() + 1200;
}

function centerPaddles() {
    if (gameOrientation === "horizontal") {
        player.width = 10;
        player.height = getPlayerLength();
        opponent.width = 10;
        opponent.height = 100;
        player.x = 20;
        opponent.x = canvas.width - 30;
        player.y = canvas.height / 2 - player.height / 2;
        opponent.y = canvas.height / 2 - opponent.height / 2;
    } else {
        player.width = getPlayerLength();
        player.height = 10;
        opponent.width = 100;
        opponent.height = 10;
        player.x = canvas.width / 2 - player.width / 2;
        opponent.x = canvas.width / 2 - opponent.width / 2;
        player.y = canvas.height - 30;
        opponent.y = 20;
    }
}

function setGameOrientation(nextOrientation) {
    if (nextOrientation === gameOrientation) {
        centerPaddles();
        return;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const dx = ball.x - cx;
    const dy = ball.y - cy;

    if (nextOrientation === "horizontal") {
        const oldVX = ball.velocityX;
        ball.x = cx - dy;
        ball.y = cy + dx;
        ball.velocityX = ball.velocityY;
        ball.velocityY = -oldVX;
    } else {
        const oldX = ball.x;
        const oldY = ball.y;
        const oldVX = ball.velocityX;
        const oldVY = ball.velocityY;
        ball.x = cx + (oldY - cy);
        ball.y = cy - (oldX - cx);
        ball.velocityX = -oldVY;
        ball.velocityY = oldVX;
    }

    gameOrientation = nextOrientation;
    updateTouchControlLabels();
    centerPaddles();
}

function clearFallingPowerUp() {
    powerUpState.active = false;
    powerUpState.type = null;
    powerUpState.x = 0;
    powerUpState.y = -30;
    powerUpState.activePickups = [];
}

function clearFallingPowerUps() {
    powerUpState.active = false;
    powerUpState.type = null;
    powerUpState.x = 0;
    powerUpState.y = -30;
    powerUpState.activePickups = [];
}

function resetPowerUps() {
    clearFallingPowerUps();
    activePowerUps = [];
    activePowerUp = null;
    extraBalls = [];
    setGameOrientation("vertical");
    powerUpSpawnAt = Infinity;
    powerUpSpawnCount = 1;
}

function scheduleNextPowerUpSpawn() {
    powerUpSpawnAt = performance.now() + getPowerUpSpawnDelay();
}

function getPowerUpSpawnDelay() {
    const elapsed = Math.max(0, rallyTime);
    if (currentDifficulty === "easy") return Math.max(3500, 6500 - elapsed * 45) + Math.random() * 1800;
    if (currentDifficulty === "normal") return Math.max(3000, 8500 - elapsed * 65) + Math.random() * 1800;
    if (currentDifficulty === "hard") return Math.max(2400, 12000 - elapsed * 90) + Math.random() * 1600;
    return Math.max(1900, 16000 - elapsed * 120) + Math.random() * 1400;
}

const buffPowerUps = ["big-paddle","speed-boost","slow-ball","magnetic-ball","multi-ball","big-ball"];
const debuffPowerUps = ["small-paddle","small-ball","reverse-controls","screen-shake","ball-speed-up"];
const powerUpRampStarts = {
    easy: 60,
    normal: 70,
    hard: 80,
    extreme: 90
};

function getPowerUpRampIntensity() {
    const start = powerUpRampStarts[currentDifficulty] || 60;
    if (rallyTime < start) return 0;
    return Math.min(1, (rallyTime - start) / 45);
}

function getPowerUpSpawnCount() {
    const elapsed = rallyTime;
    const ramp = getPowerUpRampIntensity();

    if (ramp <= 0) {
        if (elapsed < 12) return 1;
        if (elapsed < 25) return Math.random() < 0.35 ? 2 : 1;
        if (elapsed < 45) return Math.random() < 0.65 ? 2 : 1;
        return Math.random() < 0.55 ? 3 : 2;
    }

    const roll = Math.random();

    // After the difficulty-specific threshold, clusters gradually grow toward
    // 2-4 simultaneous pickups. Lower difficulties favor larger clusters.
    const profiles = {
        easy:    {one:0.04, two:0.24, three:0.37},
        normal:  {one:0.07, two:0.34, three:0.37},
        hard:    {one:0.13, two:0.50, three:0.27},
        extreme: {one:0.20, two:0.55, three:0.20}
    };
    const p = profiles[currentDifficulty] || profiles.normal;

    const target =
        roll < p.one ? 1 :
        roll < p.one + p.two ? 2 :
        roll < p.one + p.two + p.three ? 3 : 4;

    // Blend the new cluster behavior in gradually so the threshold never
    // creates a sudden "four pickups at once" spike.
    const oldCount =
        elapsed < 12 ? 1 :
        elapsed < 25 ? (Math.random() < 0.35 ? 2 : 1) :
        elapsed < 45 ? (Math.random() < 0.65 ? 2 : 1) :
        (Math.random() < 0.55 ? 3 : 2);

    return Math.max(1, Math.min(4, Math.random() < ramp ? target : oldCount));
}

function choosePowerUpType() {
    const ramp = getPowerUpRampIntensity();

    // Before the threshold, keep the power-up pool relatively mixed.
    // After it, each difficulty shifts the ecosystem in a different direction.
    let buffChance = 0.55;
    let debuffChance = 0.35;
    const mysteryChance = 0.10;

    if (ramp > 0) {
        const targetWeights = {
            easy:    {buff:0.78, debuff:0.12},
            normal:  {buff:0.58, debuff:0.32},
            hard:    {buff:0.30, debuff:0.60},
            extreme: {buff:0.18, debuff:0.72}
        };
        const target = targetWeights[currentDifficulty] || targetWeights.normal;
        buffChance = 0.55 + (target.buff - 0.55) * ramp;
        debuffChance = 0.35 + (target.debuff - 0.35) * ramp;
    }

    const orientationChance =
        (currentDifficulty === "hard" || currentDifficulty === "extreme")
            ? 0.08
            : 0;

    const roll = Math.random();

    if (roll < mysteryChance) return "mystery";
    if (orientationChance > 0 && roll < mysteryChance + orientationChance) {
        return "orientation-shift";
    }

    const regularTotal = Math.max(0.001, buffChance + debuffChance);
    const regularRoll = Math.random();
    if (regularRoll < buffChance / regularTotal) {
        return buffPowerUps[Math.floor(Math.random() * buffPowerUps.length)];
    }

    return debuffPowerUps[Math.floor(Math.random() * debuffPowerUps.length)];
}

function activatePowerUp(type) {
    if (type === "mystery") {
        const ramp = getPowerUpRampIntensity();
        const targetWeights = {
            easy: {buff:0.78, debuff:0.12},
            normal: {buff:0.58, debuff:0.32},
            hard: {buff:0.30, debuff:0.60},
            extreme: {buff:0.18, debuff:0.72}
        };
        const target = targetWeights[currentDifficulty] || targetWeights.normal;
        const buffChance = 0.55 + (target.buff - 0.55) * ramp;
        type = Math.random() < buffChance
            ? buffPowerUps[Math.floor(Math.random() * buffPowerUps.length)]
            : debuffPowerUps[Math.floor(Math.random() * debuffPowerUps.length)];
    }

    const duration = type === "orientation-shift"
        ? 5000 + Math.random() * 5000
        : powerUpDurations[type] || 6000;

    const effect = {
        type,
        startedAt: performance.now(),
        duration,
        remaining: duration
    };

    activePowerUps.push(effect);
    activePowerUp = effect;

    if (type === "orientation-shift") {
        setGameOrientation("horizontal");
    }

    if (type === "multi-ball") {
        extraBalls.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: 11,
            velocityX: -ball.velocityX * 0.82,
            velocityY: -ball.velocityY * 0.82,
            visible: true
        });
    }
}

function collectPowerUp(pickup) {
    pickup.active = false;
    activatePowerUp(pickup.type);
    scheduleNextPowerUpSpawn();
}

function updatePowerUps() {
    if (!gameStarted || gameOver || isPaused || transitionActive) return;

    const now = performance.now();

    if (powerUpSpawnAt !== Infinity && now >= powerUpSpawnAt) {
        const spawnCount = getPowerUpSpawnCount();
        for (let i = 0; i < spawnCount; i++) {
            powerUpState.activePickups.push({
                active: true,
                type: choosePowerUpType(),
                x: 25 + Math.random() * (canvas.width - 50),
                y: -25 - i * 55,
                speed: 65 + Math.random() * 18,
                drift: (Math.random() * 2 - 1) * 0.75,
                phase: Math.random() * Math.PI * 2
            });
        }
        powerUpSpawnAt = Infinity;
    }

    for (const pickup of powerUpState.activePickups) {
        if (!pickup.active) continue;

        pickup.y += pickup.speed / 60;
        pickup.phase += 0.07;
        pickup.x += pickup.drift + Math.sin(pickup.phase) * 0.35;

        if (pickup.x < 20 || pickup.x > canvas.width - 20) {
            pickup.drift *= -1;
            pickup.x = Math.max(20, Math.min(canvas.width - 20, pickup.x));
        }

        const collected = gameOrientation === "horizontal"
            ? pickup.x + 18 >= player.x && pickup.x - 18 <= player.x + player.width &&
              pickup.y >= player.y && pickup.y <= player.y + player.height
            : pickup.x >= player.x && pickup.x <= player.x + player.width &&
              pickup.y + 18 >= player.y && pickup.y - 18 <= player.y + player.height;

        if (collected) {
            collectPowerUp(pickup);
        } else if (pickup.y > canvas.height + 30) {
            pickup.active = false;
            scheduleNextPowerUpSpawn();
        }
    }

    powerUpState.activePickups = powerUpState.activePickups.filter(pickup => pickup.active);

    for (let i = activePowerUps.length - 1; i >= 0; i--) {
        const effect = activePowerUps[i];
        effect.remaining = Math.max(0, effect.duration - (now - effect.startedAt));

        if (effect.remaining <= 0) {
            if (effect.type === "orientation-shift") {
                const anotherOrientation = activePowerUps.some((other, index) =>
                    index !== i && other.type === "orientation-shift" && other.remaining > 0
                );
                if (!anotherOrientation) setGameOrientation("vertical");
            }

            if (effect.type === "multi-ball" && extraBalls.length) {
                extraBalls.pop();
            }

            activePowerUps.splice(i, 1);
        }
    }

    activePowerUp = activePowerUps.length ? activePowerUps[activePowerUps.length - 1] : null;
    applyPowerUpEffects();
}

function drawPowerUp() {
    if (transitionActive || gameOver || !gameStarted) return;
    if (!powerUpState.activePickups || !powerUpState.activePickups.length) return;

    const debuffs = ["small-paddle","reverse-controls","screen-shake","ball-speed-up"];

    for (const pickup of powerUpState.activePickups) {
        const mystery = pickup.type === "mystery";
        const orientation = pickup.type === "orientation-shift";
        const isDebuff = debuffs.includes(pickup.type);

        let color = "#39FF14";
        let symbol = "+";

        if (mystery) {
            color = "#FFFFFF";
            symbol = "?";
        } else if (orientation) {
            color = "#9B2CFF";
            symbol = "↔";
        } else if (isDebuff) {
            color = "#FF3030";
            symbol = "−";
        }

        ctx.save();
        ctx.translate(pickup.x, pickup.y);
        ctx.shadowColor = color;
        ctx.shadowBlur = 22;
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        ctx.beginPath();
        if (mystery) {
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-13, -13, 26, 26);
            ctx.rotate(-Math.PI / 4);
        } else {
            ctx.arc(0, 0, 17, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = "#080914";
        ctx.font = "900 18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol, 0, 1);
        ctx.restore();
    }
}
function updatePowerUpHud() {
    const hud = document.getElementById("powerUpHud");
    if (!hud) return;

    if (!activePowerUps.length) {
        hud.classList.remove("active");
        return;
    }

    hud.classList.add("active");

    const names = {
        "big-paddle":"BIG PADDLE",
        "small-paddle":"SMALL PADDLE",
        "speed-boost":"SPEED BOOST",
        "slow-ball":"SLOW BALL",
        "magnetic-ball":"MAGNETIC BALL",
        "multi-ball":"MULTI-BALL",
        "big-ball":"BIG BALL",
        "small-ball":"SMALL BALL",
        "reverse-controls":"REVERSE CONTROLS",
        "screen-shake":"SCREEN SHAKE",
        "ball-speed-up":"BALL SPEED UP",
        "orientation-shift":"ORIENTATION SHIFT"
    };

    const visible = activePowerUps
        .slice()
        .sort((a,b) => a.remaining - b.remaining);

    const label = visible.map(effect => {
        const count = activePowerUps.filter(item => item.type === effect.type).length;
        return (names[effect.type] || effect.type.toUpperCase()) + (count > 1 ? " x" + count : "");
    });

    document.getElementById("powerUpName").textContent = [...new Set(label)].join(" • ");
    const shortest = visible[0];
    document.getElementById("powerUpTime").textContent = (shortest.remaining / 1000).toFixed(1) + "s";
    document.getElementById("powerUpBar").style.width =
        (shortest.remaining / shortest.duration * 100) + "%";
}
function beginMatch(introText) {
    hideEndScreen();
    gameStarted = true;
    gameOver = false;
    isPaused = false;
    pauseOverlay.classList.remove("open");
    transitionActive = true;
    transitionPhase = "start-intro";
    transitionStartTime = performance.now();

    playerScore = 0;
    opponentScore = 0;
    rallyCount = 0;
    longestRally = 0;
    resetPowerUps();

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
    clearFallingPowerUp();
    powerUpState.activePickups = [];
    powerUpSpawnAt = Infinity;
    powerUpSpawnAt = Infinity;
    centerPaddles();
    extraBalls = [];
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = 0;
    ball.velocityY = 0;
    ball.visible = false;

    if (getPowerUpCount("orientation-shift") > 0) {
        setGameOrientation("vertical");
        activePowerUps = activePowerUps.filter(effect => effect.type !== "orientation-shift");
        activePowerUp = activePowerUps.length ? activePowerUps[activePowerUps.length - 1] : null;
    }

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

    // No falling pickup can exist or spawn during SCORE / READY / GO.
    powerUpState.activePickups = [];
    powerUpSpawnAt = Infinity;

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

        centerPaddles();
        launchBall();
        scheduleNextPowerUpSpawn();
    }
}

function triggerScoreSequence(playerWon) {
    clearFallingPowerUp();
    powerUpState.activePickups = [];
    powerUpSpawnAt = Infinity;

    const winnerClass = playerWon ? "player" : "ai";
    const winnerText = playerWon ? "PLAYER SCORED!" : "AI SCORED!";
    const winnerColor = playerWon ? "#55E7FF" : "#FF2BD6";

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
        winnerColor = "#55E7FF";
    } else if (opponentScore > playerScore) {
        winnerText = "AI WINS!";
        winnerColor = "#FF2BD6";
    }

    scoreFlashElement.classList.remove("ai", "player");
    void scoreFlashElement.offsetWidth;

    if (playerScore > opponentScore) scoreFlashElement.classList.add("player");
    if (opponentScore > playerScore) scoreFlashElement.classList.add("ai");

    showAnnouncement(winnerText, winnerColor, "show-ready");
    scoreStatusElement.textContent = "";
    setTimeout(() => {
        if (gameOver) showEndScreen(playerScore > opponentScore);
    }, 700);
}

function scorePoint(playerWon) {
    if (transitionActive || gameOver) return;

    const completedRally = rallyTime;
    rallyCount++;
    longestRally = Math.max(longestRally, completedRally);

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
        scoreStatusElement.textContent = "";
        setTimeout(() => {
            if (gameOver) showEndScreen(playerWon);
        }, 700);
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

function handleBallPaddleCollision(activeBall, isExtra = false) {
    const currentSpeed = getCurrentBallSpeed();
    const left = activeBall.x - activeBall.size / 2;
    const right = activeBall.x + activeBall.size / 2;
    const top = activeBall.y - activeBall.size / 2;
    const bottom = activeBall.y + activeBall.size / 2;

    if (gameOrientation === "horizontal") {
        if (right >= player.x && left <= player.x + player.width &&
            bottom >= player.y && top <= player.y + player.height && activeBall.velocityX < 0) {
            const hitPosition = (activeBall.y - (player.y + player.height / 2)) / (player.height / 2);
            const finalAngle = hitPosition * (Math.PI / 3);
            activeBall.velocityX = Math.cos(finalAngle) * currentSpeed;
            activeBall.velocityY = Math.sin(finalAngle) * currentSpeed;
            activeBall.x = player.x + player.width + activeBall.size / 2;
        }

        if (right >= opponent.x && left <= opponent.x + opponent.width &&
            bottom >= opponent.y && top <= opponent.y + opponent.height && activeBall.velocityX > 0) {
            const hitPosition = (activeBall.y - (opponent.y + opponent.height / 2)) / (opponent.height / 2);
            const finalAngle = hitPosition * (Math.PI / 3);
            activeBall.velocityX = -Math.cos(finalAngle) * currentSpeed;
            activeBall.velocityY = Math.sin(finalAngle) * currentSpeed;
            activeBall.x = opponent.x - activeBall.size / 2;
        }
        return;
    }

    if (bottom >= player.y && top <= player.y + player.height &&
        right >= player.x && left <= player.x + player.width && activeBall.velocityY > 0) {
        const hitPosition = (activeBall.x - (player.x + player.width / 2)) / (player.width / 2);
        const randomAngle = (Math.random() * 2 - 1) * (currentDifficulty === "extreme" ? 0.12 : 0.28) * Math.min(rallyTime / 18, 1);
        const finalAngle = hitPosition + randomAngle;
        activeBall.velocityX = Math.sin(finalAngle) * currentSpeed;
        activeBall.velocityY = -Math.cos(finalAngle) * currentSpeed;
        activeBall.y = player.y - activeBall.size / 2;
    }

    if (top <= opponent.y + opponent.height && bottom >= opponent.y &&
        right >= opponent.x && left <= opponent.x + opponent.width && activeBall.velocityY < 0) {
        const hitPosition = (activeBall.x - (opponent.x + opponent.width / 2)) / (opponent.width / 2);
        const randomAngle = (Math.random() * 2 - 1) * (currentDifficulty === "extreme" ? 0.12 : 0.28) * Math.min(rallyTime / 18, 1);
        const finalAngle = hitPosition + randomAngle;
        activeBall.velocityX = Math.sin(finalAngle) * currentSpeed;
        activeBall.velocityY = Math.cos(finalAngle) * currentSpeed;
        activeBall.y = opponent.y + opponent.height + activeBall.size / 2;
    }
}

function updateExtraBalls() {
    if (!extraBalls.length || !ball.visible || gameOver || transitionActive || isPaused) return;

    const currentSpeed = getCurrentBallSpeed() * 0.82;
    for (const extra of extraBalls) {
        const magnitude = Math.hypot(extra.velocityX, extra.velocityY) || 1;
        extra.velocityX *= currentSpeed / magnitude;
        extra.velocityY *= currentSpeed / magnitude;
        extra.x += extra.velocityX;
        extra.y += extra.velocityY;

        if (gameOrientation === "horizontal") {
            if (extra.y - extra.size / 2 <= 0 || extra.y + extra.size / 2 >= canvas.height) {
                extra.velocityY *= -1;
                extra.y = Math.max(extra.size / 2, Math.min(canvas.height - extra.size / 2, extra.y));
            }
        } else if (extra.x - extra.size / 2 <= 0 || extra.x + extra.size / 2 >= canvas.width) {
            extra.velocityX *= -1;
            extra.x = Math.max(extra.size / 2, Math.min(canvas.width - extra.size / 2, extra.x));
        }

        handleBallPaddleCollision(extra, true);
    }

    for (let i = extraBalls.length - 1; i >= 0; i--) {
        const extra = extraBalls[i];
        if (gameOrientation === "horizontal") {
            if (extra.x + extra.size / 2 < 0) {
                extraBalls.splice(i, 1);
                if (!transitionActive && !gameOver) scorePoint(false);
            } else if (extra.x - extra.size / 2 > canvas.width) {
                extraBalls.splice(i, 1);
                if (!transitionActive && !gameOver) scorePoint(true);
            }
        } else {
            if (extra.y - extra.size / 2 > canvas.height) {
                extraBalls.splice(i, 1);
                if (!transitionActive && !gameOver) scorePoint(false);
            } else if (extra.y + extra.size / 2 < 0) {
                extraBalls.splice(i, 1);
                if (!transitionActive && !gameOver) scorePoint(true);
            }
        }
    }
}

function updateBall() {
    if (!gameStarted || gameOver || transitionActive || !ball.visible || isPaused) return;

    rallyTime = (performance.now() - rallyStartTime) / 1000;
    const currentSpeed = getCurrentBallSpeed();
    applyPowerUpEffects();
    const currentMagnitude = Math.hypot(ball.velocityX, ball.velocityY) || 1;
    ball.velocityX *= currentSpeed / currentMagnitude;
    ball.velocityY *= currentSpeed / currentMagnitude;

    if (getPowerUpCount("magnetic-ball") > 0 && gameOrientation === "vertical" && ball.velocityX !== 0) {
        const targetX = player.x + player.width / 2;
        ball.velocityX += (targetX - ball.x) * (0.0018 * getPowerUpCount("magnetic-ball"));
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (gameOrientation === "horizontal") {
        if (ball.y - ball.size / 2 <= 0 || ball.y + ball.size / 2 >= canvas.height) {
            ball.velocityY = -ball.velocityY;
            ball.y = Math.max(ball.size / 2, Math.min(canvas.height - ball.size / 2, ball.y));
        }
    } else if (ball.x - ball.size / 2 <= 0 || ball.x + ball.size / 2 >= canvas.width) {
        ball.velocityX = -ball.velocityX;
        ball.x = Math.max(ball.size / 2, Math.min(canvas.width - ball.size / 2, ball.x));
    }

    handleBallPaddleCollision(ball);

    if (gameOrientation === "horizontal") {
        if (ball.x + ball.size / 2 < 0) scorePoint(false);
        if (ball.x - ball.size / 2 > canvas.width) scorePoint(true);
    } else {
        if (ball.y - ball.size / 2 > canvas.height) scorePoint(false);
        if (ball.y + ball.size / 2 < 0) scorePoint(true);
    }

    updateExtraBalls();
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
    drawRoundedPaddle(player, "#55E7FF");
}

function drawOpponent() {
    drawRoundedPaddle(opponent, "#FF2BD6");
}

function drawOneBall(activeBall) {
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "#FFFFFF";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(activeBall.x, activeBall.y, activeBall.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawBall() {
    if (!ball.visible || transitionActive || gameOver || !gameStarted) return;
    drawOneBall(ball);
    extraBalls.forEach(drawOneBall);
}

function showEndScreen(playerWon) {
    endScreen.classList.add("open");
    endTitle.textContent = playerWon ? "YOU WIN" : "YOU LOSE";
    endTitle.classList.toggle("win", playerWon);
    endTitle.classList.toggle("loss", !playerWon);
    endStamp.textContent = playerWon ? "MATCH COMPLETE" : "MATCH TERMINATED";
    endScore.textContent = playerScore + " : " + opponentScore;
    endStats.textContent =
        rallyCount + " / " + Math.round(longestRally) + "s";
    endMessage.textContent = playerWon
        ? "YOU BEAT THE MACHINE. RUN IT BACK."
        : "THE MACHINE GOT THE LAST WORD.";
}

function hideEndScreen() {
    endScreen.classList.remove("open");
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

endRestartButton.addEventListener("click", function() {
    hideEndScreen();
    restartGame();
});

endMenuButton.addEventListener("click", function() {
    hideEndScreen();
    exitMatch();
});

endDifficultyButton.addEventListener("click", function() {
    hideEndScreen();
    isPaused = false;
    gameStarted = false;
    gameOver = false;
    transitionActive = false;
    ball.visible = false;
    showScreen(difficultyScreen);
    openDifficultyPage();
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateOpponent();
    updateBall();
    updateTransition();
    updateEndlessTimer();
    updatePowerUps();

    const shaking = Boolean(getActivePowerUp("screen-shake"));
    if (shaking) {
        ctx.save();
        const intensity = 2.4;
        ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
    }

    drawPlayer();
    drawOpponent();
    drawBall();
    drawPowerUp();

    if (shaking) ctx.restore();

    updatePowerUpHud();

    requestAnimationFrame(gameLoop);
}

setDifficulty(currentDifficulty);
updateSavedDifficultyUI();
updateScoreboard();
gameLoop();