
// =====================================
// TYPEQUEST - KEY MAGNET GAME
// =====================================


// HTML ELEMENTS
const targetKey = document.getElementById("target-key");
const keyScore = document.getElementById("key-score");
const keyTimer = document.getElementById("key-timer");
const keyCorrect = document.getElementById("key-correct");
const keyFeedback = document.getElementById("key-feedback");
const keyDetails = document.getElementById("key-details");

const startKeyGame = document.getElementById("start-keygame");
const stopKeyGame = document.getElementById("stop-keygame");

const keySet = document.getElementById("key-set");
const keyDifficulty = document.getElementById("key-difficulty");

const virtualKeyboard = document.getElementById("virtual-keyboard");


// GAME VARIABLES
let keyGameRunning = false;
let keyGameTime = 30;
let keyGameScore = 0;

let correctKeys = 0;
let incorrectKeys = 0;

let currentTarget = "";
let keyStartTime = 0;
let totalResponseTime = 0;

let keyInterval = null;


// KEYBOARD ARRAYS
const keySets = {
    home: ["A", "S", "D", "F", "J", "K", "L"],
    top: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    bottom: ["Z", "X", "C", "V", "B", "N", "M"],
    all: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
};


// =====================================
// CREATE AND UPDATE VIRTUAL KEYBOARD
// =====================================

function updateVirtualKeyboard() {

    const keys = virtualKeyboard.querySelectorAll(".virtual-key");

    keys.forEach(function (key) {

        const letter = key.dataset.key;

        key.classList.remove(
            "home-row-key",
            "target-key-active"
        );

        // Highlight home row keys
        if ("ASDFJKL".includes(letter)) {
            key.classList.add("home-row-key");
        }

        // Highlight current target
        if (letter === currentTarget && keyGameRunning) {
            key.classList.add("target-key-active");
        }

    });

}


// =====================================
// SELECT RANDOM KEY
// =====================================

function selectRandomKey() {

    const selectedSet = keySets[keySet.value] || keySets.home;

    let availableKeys = selectedSet;

    // On hard mode, avoid repeating the previous key when possible.
    if (
        keyDifficulty.value === "hard" &&
        selectedSet.length > 1
    ) {
        availableKeys = selectedSet.filter(function (letter) {
            return letter !== currentTarget;
        });
    }

    const randomIndex = Math.floor(
        Math.random() * availableKeys.length
    );

    currentTarget = availableKeys[randomIndex];

    targetKey.textContent = currentTarget;

    keyStartTime = Date.now();

    updateVirtualKeyboard();

}


// =====================================
// UPDATE SCORE DETAILS
// =====================================

function updateKeyDetails() {

    const totalAttempts = correctKeys + incorrectKeys;

    const accuracy = totalAttempts > 0
        ? Math.round((correctKeys / totalAttempts) * 100)
        : 0;

    const averageTime = correctKeys > 0
        ? Math.round(totalResponseTime / correctKeys)
        : 0;

    keyDetails.textContent =
        "Correct: " + correctKeys +
        " | Incorrect: " + incorrectKeys +
        " | Accuracy: " + accuracy + "%" +
        " | Average Response: " + averageTime + " ms";

}


// =====================================
// START GAME
// =====================================

function startKeyMagnet() {

    if (keyGameRunning) {
        return;
    }

    if (
        document.body.dataset.activeMiniGame &&
        document.body.dataset.activeMiniGame !== "key"
    ) {
        alert("Please stop the other mini-game first.");
        return;
    }

    document.body.dataset.activeMiniGame = "key";

    keyGameRunning = true;

    keyGameTime = 30;
    keyGameScore = 0;

    correctKeys = 0;
    incorrectKeys = 0;
    totalResponseTime = 0;

    keyScore.textContent = keyGameScore;
    keyTimer.textContent = keyGameTime;
    keyCorrect.textContent = correctKeys;

    keyFeedback.textContent =
        "Game started! Press the highlighted target key.";

    keyFeedback.style.color = "#6654e8";

    selectRandomKey();

    updateKeyDetails();


    // TIMER
    keyInterval = setInterval(function () {

        keyGameTime--;

        keyTimer.textContent = keyGameTime;

        if (keyGameTime <= 0) {
            finishKeyMagnet();
        }

    }, 1000);

}


// =====================================
// CHECK PHYSICAL KEYBOARD INPUT
// =====================================

function checkKeyPress(event) {

    if (!keyGameRunning) {
        return;
    }

    // Ignore special keys and shortcuts
    if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.key.length !== 1
    ) {
        return;
    }

    const pressedKey = event.key.toUpperCase();

    if (!/^[A-Z]$/.test(pressedKey)) {
        return;
    }

    if (pressedKey === currentTarget) {

        // CORRECT KEY
        correctKeys++;

        const responseTime = Date.now() - keyStartTime;

        totalResponseTime += responseTime;

        keyGameScore += 10;

        keyFeedback.textContent =
            "Correct! Response time: " + responseTime + " ms";

        keyFeedback.style.color = "#21b78a";

        keyScore.textContent = keyGameScore;

        keyCorrect.textContent = correctKeys;

        selectRandomKey();

    } else {

        // INCORRECT KEY
        incorrectKeys++;

        keyGameScore = Math.max(0, keyGameScore - 2);

        keyFeedback.textContent =
            "Wrong key! Target key is " + currentTarget;

        keyFeedback.style.color = "#e34d5b";

        keyScore.textContent = keyGameScore;

    }

    updateKeyDetails();

}


// =====================================
// FINISH GAME
// =====================================

function finishKeyMagnet() {

    if (!keyGameRunning) {
        return;
    }

    keyGameRunning = false;

    clearInterval(keyInterval);
    keyInterval = null;

    document.body.dataset.activeMiniGame = "";


    const totalAttempts = correctKeys + incorrectKeys;

    const accuracy = totalAttempts > 0
        ? Math.round((correctKeys / totalAttempts) * 100)
        : 0;

    const averageTime = correctKeys > 0
        ? Math.round(totalResponseTime / correctKeys)
        : 0;


    targetKey.textContent = "✓";

    keyFeedback.textContent =
        "Game Over! Final Accuracy: " + accuracy + "%";

    keyFeedback.style.color = "#6654e8";


    updateVirtualKeyboard();
    updateKeyDetails();


    // SAVE GAME SCORE
    if (typeof saveGameScore === "function") {
        saveGameScore("key", keyGameScore);
    }


    // DISPLAY FINAL RESULTS
    alert(
        "KEY MAGNET RESULTS\n\n" +
        "Score: " + keyGameScore + "\n" +
        "Correct Keys: " + correctKeys + "\n" +
        "Incorrect Keys: " + incorrectKeys + "\n" +
        "Accuracy: " + accuracy + "%\n" +
        "Average Response Time: " + averageTime + " ms"
    );

}


// =====================================
// STOP GAME
// =====================================

function stopKeyMagnet() {

    if (!keyGameRunning) {
        return;
    }

    finishKeyMagnet();

}


// =====================================
// BUTTON EVENTS
// =====================================

startKeyGame.addEventListener("click", startKeyMagnet);

stopKeyGame.addEventListener("click", stopKeyMagnet);


// =====================================
// KEYBOARD EVENT
// =====================================

document.addEventListener("keydown", function (event) {

    // Do not process typing in input fields
    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.tagName === "SELECT"
    ) {
        return;
    }

    checkKeyPress(event);

});


// =====================================
// INITIALIZE GAME
// =====================================

targetKey.textContent = "A";

updateVirtualKeyboard();
updateKeyDetails();
