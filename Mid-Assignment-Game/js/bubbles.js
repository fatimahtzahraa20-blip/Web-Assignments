
// =========================================
// TYPEQUEST - IMPROVED BUBBLE POP GAME
// =========================================

let bubbleScore = 0;
let bubbleMissed = 0;
let bubbleTime = 30;
let bubbleWrong = 0;

let bubbleActive = false;

let bubbleTimerInterval;
let bubbleSpawnInterval;
let bubbleMoveInterval;

let bubbleDifficulty = "medium";
let bubbleSpeed = 2;
let bubbleSpawnSpeed = 1000;
let maximumBubbles = 10;

const bubbleStartButton = document.getElementById("start-bubbles");
const bubbleStopButton = document.getElementById("stop-bubbles");

const bubblePlayground = document.getElementById("bubble-playground");
const bubbleMessage = document.getElementById("bubble-message");

const bubbleScoreDisplay = document.getElementById("bubble-score");
const bubbleTimerDisplay = document.getElementById("bubble-timer");
const bubbleMissedDisplay = document.getElementById("bubble-missed");

// Optional difficulty selector.
// We will add this control to index.html.
const bubbleDifficultySelect =
    document.getElementById("bubble-difficulty");

let bubbleTimers = [];


// =========================================
// 1. DIFFICULTY SETTINGS
// =========================================

function setBubbleDifficulty() {

    if (bubbleDifficultySelect) {
        bubbleDifficulty = bubbleDifficultySelect.value;
    }

    if (bubbleDifficulty === "easy") {
        bubbleSpeed = 1;
        bubbleSpawnSpeed = 1400;
        maximumBubbles = 8;
    } 
    else if (bubbleDifficulty === "hard") {
        bubbleSpeed = 4;
        bubbleSpawnSpeed = 650;
        maximumBubbles = 15;
    } 
    else {
        bubbleSpeed = 2;
        bubbleSpawnSpeed = 1000;
        maximumBubbles = 10;
    }
}


// =========================================
// 2. UPDATE GAME STATISTICS
// =========================================

function updateBubbleStats() {

    bubbleScoreDisplay.textContent = bubbleScore;
    bubbleTimerDisplay.textContent = bubbleTime;
    bubbleMissedDisplay.textContent = bubbleMissed;
}


// =========================================
// 3. GENERATE RANDOM LETTER
// =========================================

function getRandomBubbleLetter() {

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const randomIndex = Math.floor(
        Math.random() * letters.length
    );

    return letters[randomIndex];
}


// =========================================
// 4. CREATE BUBBLES
// =========================================

function createBubble() {

    if (!bubbleActive) return;

    const currentBubbles =
        bubblePlayground.querySelectorAll(".bubble");

    if (currentBubbles.length >= maximumBubbles) {
        return;
    }

    const bubble = document.createElement("div");

    bubble.classList.add("bubble");

    const letter = getRandomBubbleLetter();

    bubble.textContent = letter;
    bubble.dataset.letter = letter;

    const playgroundWidth = bubblePlayground.clientWidth;

    const bubbleSize = 52;

    const maxX = Math.max(
        0,
        playgroundWidth - bubbleSize
    );

    const randomX = Math.floor(
        Math.random() * (maxX + 1)
    );

    // Start bubbles near the bottom
    bubble.style.left = randomX + "px";
    bubble.style.top =
        (bubblePlayground.clientHeight - bubbleSize) + "px";

    bubblePlayground.appendChild(bubble);
}


// =========================================
// 5. MOVE BUBBLES UPWARD
// =========================================

function moveBubbles() {

    if (!bubbleActive) return;

    const bubbles =
        bubblePlayground.querySelectorAll(".bubble");

    bubbles.forEach((bubble) => {

        let currentTop = parseFloat(bubble.style.top);

        currentTop -= bubbleSpeed;

        bubble.style.top = currentTop + "px";

        // Bubble reached the top
        if (currentTop <= 0) {

            bubble.remove();

            bubbleMissed++;

            updateBubbleStats();

            // Game ends after six missed bubbles
            if (bubbleMissed >= 6) {
                endBubbleGame("You missed six bubbles!");
            }
        }
    });
}


// =========================================
// 6. POP MATCHING BUBBLE
// =========================================

function handleBubbleKey(event) {

    if (!bubbleActive) return;

    // Ignore typing in text fields
    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    if (!/^[a-z]$/i.test(event.key)) return;

    const pressedLetter = event.key.toUpperCase();

    const bubbles =
        bubblePlayground.querySelectorAll(".bubble");

    let matched = false;

    for (let bubble of bubbles) {

        if (bubble.dataset.letter === pressedLetter) {

            bubble.remove();

            bubbleScore += 10;

            matched = true;

            updateBubbleStats();

            break;
        }
    }

    // Apply penalty for an incorrect letter
    if (!matched) {

        bubbleWrong++;

        bubbleScore = Math.max(0, bubbleScore - 5);

        updateBubbleStats();

        bubbleMessage.textContent =
            "Wrong key! 5 points deducted.";

        bubbleMessage.classList.remove("hidden");

        setTimeout(() => {
            if (bubbleActive) {
                bubbleMessage.classList.add("hidden");
            }
        }, 700);
    }
}


// =========================================
// 7. START GAME
// =========================================

function startBubbleGame() {

    if (bubbleActive) return;

    // Prevent another mini-game from running simultaneously
    if (
        document.body.dataset.activeMiniGame &&
        document.body.dataset.activeMiniGame !== "bubble"
    ) {
        alert("Please finish the other mini-game first.");
        return;
    }

    clearBubbleIntervals();

    bubblePlayground
        .querySelectorAll(".bubble")
        .forEach((bubble) => bubble.remove());

    bubbleScore = 0;
    bubbleMissed = 0;
    bubbleWrong = 0;
    bubbleTime = 30;

    setBubbleDifficulty();

    bubbleActive = true;

    document.body.dataset.activeMiniGame = "bubble";

    updateBubbleStats();

    bubbleMessage.textContent =
        "Match the letters before the bubbles reach the top!";

    bubbleMessage.classList.remove("hidden");

    bubbleStartButton.disabled = true;
    bubbleStopButton.disabled = false;

    if (bubbleDifficultySelect) {
        bubbleDifficultySelect.disabled = true;
    }

    // Create five bubbles at the beginning
    for (let i = 0; i < 5; i++) {
        createBubble();
    }

    // Create new bubbles regularly
    bubbleSpawnInterval = setInterval(() => {
        createBubble();
    }, bubbleSpawnSpeed);

    // Move bubbles upward
    bubbleMoveInterval = setInterval(() => {
        moveBubbles();
    }, 40);

    // Countdown timer
    bubbleTimerInterval = setInterval(() => {

        bubbleTime--;

        updateBubbleStats();

        if (bubbleTime <= 0) {
            endBubbleGame("Time is over!");
        }

    }, 1000);

    document.addEventListener("keydown", handleBubbleKey);
}


// =========================================
// 8. CLEAR GAME INTERVALS
// =========================================

function clearBubbleIntervals() {

    clearInterval(bubbleTimerInterval);
    clearInterval(bubbleSpawnInterval);
    clearInterval(bubbleMoveInterval);
}


// =========================================
// 9. END GAME
// =========================================

function endBubbleGame(message) {

    if (!bubbleActive) return;

    bubbleActive = false;

    clearBubbleIntervals();

    document.removeEventListener(
        "keydown",
        handleBubbleKey
    );

    delete document.body.dataset.activeMiniGame;

    bubblePlayground
        .querySelectorAll(".bubble")
        .forEach((bubble) => bubble.remove());

    bubbleStartButton.disabled = false;
    bubbleStopButton.disabled = false;

    if (bubbleDifficultySelect) {
        bubbleDifficultySelect.disabled = false;
    }

    bubbleMessage.innerHTML = `
        <h3>Game Over!</h3>
        <p>${message}</p>
        <p>Final Score: ${bubbleScore}</p>
        <p>Missed Bubbles: ${bubbleMissed}</p>
        <p>Incorrect Keys: ${bubbleWrong}</p>
    `;

    bubbleMessage.classList.remove("hidden");

    // Save score in dashboard
    saveGameScore("bubble", bubbleScore);
}


// =========================================
// 10. BUTTON EVENTS
// =========================================

bubbleStartButton.addEventListener(
    "click",
    startBubbleGame
);

bubbleStopButton.addEventListener("click", () => {

    if (bubbleActive) {
        endBubbleGame("You stopped the game.");
    }

});


// =========================================
// 11. INITIAL SETTINGS
// =========================================

bubbleStopButton.disabled = false;

if (bubbleDifficultySelect) {
    bubbleDifficultySelect.addEventListener(
        "change",
        setBubbleDifficulty
    );
}

updateBubbleStats();
