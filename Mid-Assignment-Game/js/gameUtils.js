
// =====================================
// 1. DEFAULT PLAYER DATA
// =====================================

const defaultPlayerData = {
    wpm: 0,
    accuracy: 0,
    score: 0,
    tests: 0,
    level: 1,
    bubbleScore: 0,
    keyScore: 0,
    wordScore: 0
};


// =====================================
// 2. LOAD SAVED PLAYER DATA
// =====================================

function loadPlayerData() {

    const savedData = localStorage.getItem("typeQuestData");

    if (savedData) {
        try {
            return {
                ...defaultPlayerData,
                ...JSON.parse(savedData)
            };
        } catch (error) {
            console.log("Unable to load saved progress.");
        }
    }

    return { ...defaultPlayerData };
}


let playerData = loadPlayerData();


// =====================================
// 3. SAVE PLAYER DATA
// =====================================

function savePlayerData() {

    localStorage.setItem(
        "typeQuestData",
        JSON.stringify(playerData)
    );

}


// =====================================
// 4. SCORE CALCULATION
// =====================================

function calculateScore(wpm, accuracy) {

    const score = Math.round(
        wpm * accuracy / 100
    );

    return score * 10;

}


// =====================================
// 5. UPDATE DASHBOARD
// =====================================

function updateDashboard() {

    document.getElementById("dashboard-wpm").textContent =
        playerData.wpm;

    document.getElementById("dashboard-accuracy").textContent =
        playerData.accuracy;

    document.getElementById("dashboard-score").textContent =
        playerData.score;

    document.getElementById("dashboard-tests").textContent =
        playerData.tests;

    document.getElementById("user-level").textContent =
        playerData.level;


    // Update leaderboard

    document.getElementById("leader-wpm").textContent =
        playerData.wpm;

    document.getElementById("leader-accuracy").textContent =
        playerData.accuracy + "%";

    document.getElementById("leader-score").textContent =
        playerData.score;

}


// =====================================
// 6. UPDATE ACHIEVEMENTS
// =====================================

function updateAchievements() {

    const firstTest = document.getElementById("first-test-status");
    const speed = document.getElementById("speed-status");
    const accuracy = document.getElementById("accuracy-status");
    const champion = document.getElementById("champion-status");

    if (firstTest) {
        firstTest.textContent =
            playerData.tests >= 1 ? "Unlocked" : "Locked";

        firstTest.className =
            playerData.tests >= 1 ? "unlocked" : "locked";
    }

    if (speed) {
        speed.textContent =
            playerData.wpm >= 30 ? "Unlocked" : "Locked";

        speed.className =
            playerData.wpm >= 30 ? "unlocked" : "locked";
    }

    if (accuracy) {
        accuracy.textContent =
            playerData.accuracy >= 95 ? "Unlocked" : "Locked";

        accuracy.className =
            playerData.accuracy >= 95 ? "unlocked" : "locked";
    }

    if (champion) {
        champion.textContent =
            playerData.tests >= 5 ? "Unlocked" : "Locked";

        champion.className =
            playerData.tests >= 5 ? "unlocked" : "locked";
    }

}


// =====================================
// 7. SAVE TYPING TEST RESULT
// =====================================

function saveTestResult(wpm, accuracy) {

    const score = calculateScore(wpm, accuracy);

    playerData.wpm = Math.max(playerData.wpm, wpm);

    playerData.accuracy = Math.max(
        playerData.accuracy,
        Math.round(accuracy)
    );

    playerData.score += score;

    playerData.tests++;

    playerData.level = Math.floor(
        playerData.score / 500
    ) + 1;

    savePlayerData();

    updateDashboard();

    updateAchievements();

    return score;

}


// =====================================
// 8. SAVE MINI GAME SCORES
// =====================================

function saveGameScore(game, points) {

    if (game === "bubble") {

        playerData.bubbleScore += points;

    } else if (game === "key") {

        playerData.keyScore += points;

    } else if (game === "word") {

        playerData.wordScore += points;

    }

    playerData.score += points;

    playerData.level = Math.floor(
        playerData.score / 500
    ) + 1;

    savePlayerData();

    updateDashboard();

    updateAchievements();

}


// =====================================
// 9. RESET PLAYER PROGRESS
// =====================================

function resetPlayerProgress() {

    const confirmReset = confirm(
        "Are you sure you want to reset all your progress?"
    );

    if (!confirmReset) {
        return;
    }

    playerData = { ...defaultPlayerData };

    savePlayerData();

    updateDashboard();

    updateAchievements();

    alert("Your progress has been reset successfully!");

}


// =====================================
// 10. SETTINGS
// =====================================

function initializeSettings() {

    const soundSetting = document.getElementById("sound-setting");

    const tipsSetting = document.getElementById("tips-setting");

    const resetButton = document.getElementById("reset-progress");


    if (soundSetting) {

        soundSetting.checked =
            localStorage.getItem("typeQuestSound") !== "false";

        soundSetting.addEventListener("change", function () {

            localStorage.setItem(
                "typeQuestSound",
                soundSetting.checked
            );

        });

    }


    if (tipsSetting) {

        tipsSetting.checked =
            localStorage.getItem("typeQuestTips") !== "false";

        tipsSetting.addEventListener("change", function () {

            localStorage.setItem(
                "typeQuestTips",
                tipsSetting.checked
            );

        });

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetPlayerProgress
        );

    }

}


// =====================================
// 11. CURRENT YEAR
// =====================================

function updateCurrentYear() {

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

}


// =====================================
// 12. INITIALIZE COMMON FEATURES
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    updateDashboard();

    updateAchievements();

    initializeSettings();

    updateCurrentYear();

});
