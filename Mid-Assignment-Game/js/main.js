
// =====================================
// TYPEQUEST - MAIN JAVASCRIPT
// =====================================


// =====================================
// 1. PAGE NAVIGATION
// =====================================

const navigationLinks = document.querySelectorAll(".nav-link");

navigationLinks.forEach((link) => {
    link.addEventListener("click", function () {

        navigationLinks.forEach((item) => {
            item.classList.remove("active");
        });

        this.classList.add("active");
    });
});


// =====================================
// 2. TYPING TEST
// =====================================

const typingText = document.getElementById("typing-text");
const typingInput = document.getElementById("typing-input");

const startTestButton = document.getElementById("start-test");
const restartTestButton = document.getElementById("restart-test");
const tryAgainButton = document.getElementById("try-again");

const timeSelect = document.getElementById("time-select");

const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

const typingStatus = document.getElementById("typing-status");
const testResult = document.getElementById("test-result");

const resultWpm = document.getElementById("result-wpm");
const resultAccuracy = document.getElementById("result-accuracy");
const resultScore = document.getElementById("result-score");

let originalTypingText = typingText.textContent.trim();

let typingTime = 30;
let typingTimer;
let typingStarted = false;
let typingFinished = false;
let typingStartTime;
let typingCorrectCharacters = 0;
let typingTotalCharacters = 0;


// Display typing text character by character
function prepareTypingText() {
    typingText.innerHTML = "";

    originalTypingText.split("").forEach((character) => {
        const span = document.createElement("span");

        span.textContent = character;

        typingText.appendChild(span);
    });
}


// Reset typing test
function resetTypingTest() {
    clearInterval(typingTimer);

    typingStarted = false;
    typingFinished = false;

    typingTime = Number(timeSelect.value);

    typingCorrectCharacters = 0;
    typingTotalCharacters = 0;

    typingInput.value = "";
    typingInput.disabled = true;

    timerDisplay.textContent = typingTime;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";

    typingStatus.textContent = "Press Start Test to begin.";

    startTestButton.disabled = false;
    startTestButton.textContent = "Start Test";

    testResult.classList.add("hidden");

    prepareTypingText();
}


// Start typing test
function startTypingTest() {
    if (typingStarted) return;

    resetTypingTest();

    typingStarted = true;
    typingStartTime = Date.now();

    typingInput.disabled = false;
    typingInput.focus();

    startTestButton.disabled = true;
    startTestButton.textContent = "Test Running";

    typingStatus.textContent = "Start typing the displayed text!";

    typingTimer = setInterval(() => {

        typingTime--;

        timerDisplay.textContent = typingTime;

        updateTypingStats();

        if (typingTime <= 0) {
            finishTypingTest();
        }

    }, 1000);
}


// Calculate WPM and accuracy
function updateTypingStats() {

    const typedText = typingInput.value;

    const spans = typingText.querySelectorAll("span");

    let correctCharacters = 0;
    let totalTyped = typedText.length;

    spans.forEach((span, index) => {

        const typedCharacter = typedText[index];
        const originalCharacter = originalTypingText[index];

        span.classList.remove(
            "typing-input-correct",
            "typing-input-wrong"
        );

        if (typedCharacter == null) {
            return;
        }

        if (typedCharacter === originalCharacter) {
            span.classList.add("typing-input-correct");
            correctCharacters++;
        } else {
            span.classList.add("typing-input-wrong");
        }
    });

    typingCorrectCharacters = correctCharacters;
    typingTotalCharacters = totalTyped;

    const elapsedSeconds = Math.max(
        1,
        Math.floor((Date.now() - typingStartTime) / 1000)
    );

    const elapsedMinutes = elapsedSeconds / 60;

    const currentWpm = Math.round(
        (correctCharacters / 5) / elapsedMinutes
    );

    const currentAccuracy = totalTyped > 0
        ? Math.round((correctCharacters / totalTyped) * 100)
        : 100;

    wpmDisplay.textContent = currentWpm;
    accuracyDisplay.textContent = currentAccuracy + "%";
}


// Check typing input
function handleTypingInput() {

    if (!typingStarted || typingFinished) return;

    updateTypingStats();

    if (typingInput.value.length >= originalTypingText.length) {
        finishTypingTest();
    }
}


// Finish typing test
function finishTypingTest() {

    if (typingFinished) return;

    typingFinished = true;
    typingStarted = false;

    clearInterval(typingTimer);

    typingInput.disabled = true;

    startTestButton.disabled = false;
    startTestButton.textContent = "Start Test";

    const finalWpm = Number(wpmDisplay.textContent);
    const finalAccuracy = typingTotalCharacters > 0
        ? Math.round(
            (typingCorrectCharacters / typingTotalCharacters) * 100
        )
        : 0;

    // Save result in dashboard
    const finalScore = saveTestResult(
        finalWpm,
        finalAccuracy
    );

    resultWpm.textContent = finalWpm;
    resultAccuracy.textContent = finalAccuracy + "%";
    resultScore.textContent = finalScore;

    testResult.classList.remove("hidden");

    typingStatus.textContent = "Test completed! Well done.";

    timerDisplay.textContent = typingTime;
}


// Typing test buttons and input events
startTestButton.addEventListener("click", startTypingTest);

restartTestButton.addEventListener("click", resetTypingTest);

tryAgainButton.addEventListener("click", resetTypingTest);

typingInput.addEventListener("input", handleTypingInput);

timeSelect.addEventListener("change", resetTypingTest);


// =====================================
// 3. WORD CHALLENGE GAME
// =====================================

const wordStartButton = document.getElementById("start-wordgame");
const wordStopButton = document.getElementById("stop-wordgame");

const targetWordDisplay = document.getElementById("target-word");
const wordInput = document.getElementById("word-input");
const wordFeedback = document.getElementById("word-feedback");

const wordScoreDisplay = document.getElementById("word-score");
const wordTimerDisplay = document.getElementById("word-timer");
const wordCountDisplay = document.getElementById("word-count");

const wordList = [
    "javascript",
    "keyboard",
    "computer",
    "website",
    "developer",
    "function",
    "internet",
    "programming",
    "database",
    "software",
    "technology",
    "application",
    "challenge",
    "creative",
    "learning",
    "interface",
    "frontend",
    "backend"
];

let wordScore = 0;
let wordTime = 30;
let wordCount = 0;

let wordGameActive = false;
let wordTimerInterval;
let currentWord = "";


// Generate a random word
function getRandomWord() {

    const randomIndex = Math.floor(
        Math.random() * wordList.length
    );

    return wordList[randomIndex];
}


// Display a new word
function showNewWord() {

    currentWord = getRandomWord();

    targetWordDisplay.textContent = currentWord;

    wordInput.value = "";
}


// Update word game statistics
function updateWordStats() {

    wordScoreDisplay.textContent = wordScore;
    wordTimerDisplay.textContent = wordTime;
    wordCountDisplay.textContent = wordCount;
}


// Start Word Challenge
function startWordGame() {

    if (wordGameActive) return;

    wordScore = 0;
    wordTime = 30;
    wordCount = 0;

    wordGameActive = true;

    updateWordStats();

    wordInput.disabled = false;
    wordInput.focus();

    wordStartButton.disabled = true;
    wordStopButton.disabled = false;

    wordFeedback.textContent = "Type the displayed word and press Enter.";

    showNewWord();

    wordTimerInterval = setInterval(() => {

        wordTime--;

        updateWordStats();

        if (wordTime <= 0) {
            endWordGame("Time is over!");
        }

    }, 1000);
}


// Check the entered word
function checkWordAnswer(event) {

    if (event.key !== "Enter") return;

    if (!wordGameActive) return;

    const enteredWord = wordInput.value.trim().toLowerCase();

    if (enteredWord === "") return;

    if (enteredWord === currentWord) {

        wordScore += 10;
        wordCount++;

        wordFeedback.textContent = "Correct! +10 points";
        wordFeedback.style.color = "#16a34a";

        updateWordStats();

        showNewWord();

    } else {

        wordFeedback.textContent = "Incorrect! Try again.";
        wordFeedback.style.color = "#dc2626";

        wordInput.select();
    }
}


// End Word Challenge
function endWordGame(message) {

    if (!wordGameActive) return;

    wordGameActive = false;

    clearInterval(wordTimerInterval);

    wordInput.disabled = true;

    wordStartButton.disabled = false;
    wordStopButton.disabled = false;

    targetWordDisplay.textContent = "Finished!";

    wordFeedback.textContent =
        message + " Final Score: " + wordScore;

    wordFeedback.style.color = "#2563eb";

    // Save score in dashboard
    saveGameScore("word", wordScore);
}


// Word game button events
wordStartButton.addEventListener("click", startWordGame);

wordStopButton.addEventListener("click", () => {

    if (wordGameActive) {
        endWordGame("You stopped the game.");
    }

});

wordInput.addEventListener("keydown", checkWordAnswer);


// =====================================
// 4. INITIAL PAGE SETUP
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    resetTypingTest();

    // Prepare Word Challenge
    wordInput.disabled = true;

    targetWordDisplay.textContent = "Ready?";

    wordStartButton.disabled = false;
    wordStopButton.disabled = false;

    updateWordStats();

});
