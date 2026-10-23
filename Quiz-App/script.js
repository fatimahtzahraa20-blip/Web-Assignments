
"use strict";

// ========================================
// 1. QUESTION BANK
// ========================================

const questionBank = [
    {
        category: "HTML BASICS",
        difficulty: "easy",
        question: "Which HTML element creates a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        answer: 1,
        explanation: "The anchor element <a> creates hyperlinks using href."
    },
    {
        category: "CSS",
        difficulty: "easy",
        question: "Which CSS property changes text color?",
        options: ["font-style", "text-decoration", "color", "background-color"],
        answer: 2,
        explanation: "The color property controls the foreground color of text."
    },
    {
        category: "JAVASCRIPT",
        difficulty: "easy",
        question: "Which keyword declares a reassignable block-scoped variable?",
        options: ["const", "let", "static", "define"],
        answer: 1,
        explanation: "let declares a block-scoped variable that can be reassigned."
    },
    {
        category: "BOOTSTRAP",
        difficulty: "easy",
        question: "Which Bootstrap class creates a responsive container?",
        options: [".row", ".container", ".grid", ".wrapper"],
        answer: 1,
        explanation: "The .container class provides responsive widths at breakpoints."
    },
    {
        category: "HTML FORMS",
        difficulty: "easy",
        question: "Which input type checks for an email format?",
        options: ["text", "mailbox", "email", "validate"],
        answer: 2,
        explanation: 'The email input type provides built-in format validation.'
    },
    {
        category: "CSS LAYOUT",
        difficulty: "hard",
        question: "Which Flexbox property aligns items along the main axis?",
        options: ["align-items", "justify-content", "align-content", "place-items"],
        answer: 1,
        explanation: "justify-content distributes flex items along the main axis."
    },
    {
        category: "JAVASCRIPT",
        difficulty: "hard",
        question: "What does the JavaScript map() method return?",
        options: [
            "The original array only",
            "A single number",
            "A new array",
            "A boolean"
        ],
        answer: 2,
        explanation: "map() creates a new array containing transformed elements."
    },
    {
        category: "ACCESSIBILITY",
        difficulty: "hard",
        question: "What is the purpose of the aria-label attribute?",
        options: [
            "To style an element",
            "To provide an accessible name",
            "To submit a form",
            "To load an icon"
        ],
        answer: 1,
        explanation: "aria-label provides an accessible name for an element."
    },
    {
        category: "RESPONSIVE DESIGN",
        difficulty: "hard",
        question: "Which CSS feature applies styles based on viewport conditions?",
        options: ["@keyframes", "@import", "@media", "@font-face"],
        answer: 2,
        explanation: "Media queries adapt CSS to viewport and device conditions."
    },
    {
        category: "JAVASCRIPT DOM",
        difficulty: "hard",
        question: "Which method selects the first matching CSS selector?",
        options: [
            "getElementsByClass()",
            "querySelector()",
            "selectFirst()",
            "findElement()"
        ],
        answer: 1,
        explanation: "querySelector() returns the first matching element."
    },
    {
        category: "HTML SEMANTICS",
        difficulty: "hard",
        question: "Which element identifies the main content of a page?",
        options: ["<section>", "<aside>", "<main>", "<footer>"],
        answer: 2,
        explanation: "The main element identifies the dominant page content."
    },
    {
        category: "CSS BOX MODEL",
        difficulty: "hard",
        question: "What does box-sizing: border-box do?",
        options: [
            "Hides padding",
            "Includes padding and border in the declared width",
            "Adds a shadow",
            "Automatically makes an element responsive"
        ],
        answer: 1,
        explanation: "border-box includes content, padding, and border in the declared dimensions."
    }
];

// ========================================
// 2. SELECT HTML ELEMENTS
// ========================================

const $ = id => document.getElementById(id);

const welcomeScreen = $("welcomeScreen");
const quizScreen = $("quizScreen");
const resultScreen = $("resultScreen");

const letters = ["A", "B", "C", "D"];

let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timerInterval = null;
let startTime = 0;
let totalTime = 0;
let userAnswers = [];
let answerLocked = false;
let quizFinished = false;

// ========================================
// 3. SHUFFLE QUESTIONS AND ANSWERS
// ========================================

function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

// ========================================
// 4. SCREEN NAVIGATION
// ========================================

function showScreen(screen) {
    welcomeScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");

    screen.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ========================================
// 5. START THE QUIZ
// ========================================

function startQuiz() {
    clearInterval(timerInterval);

    const difficulty = $("difficulty").value;

    let availableQuestions = questionBank;

    if (difficulty !== "all") {
        availableQuestions = questionBank.filter(
            question => question.difficulty === difficulty
        );
    }

    // Select up to 10 randomized questions.
    const selectedQuestions = shuffleArray(availableQuestions)
        .slice(0, 10);

    // Shuffle options while keeping the correct answer accurate.
    questions = selectedQuestions.map(question => {
        const shuffledOptions = shuffleArray(
            question.options.map((text, originalIndex) => ({
                text,
                originalIndex
            }))
        );

        return {
            ...question,
            options: shuffledOptions.map(option => option.text),
            answer: shuffledOptions.findIndex(
                option => option.originalIndex === question.answer
            )
        };
    });

    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    totalTime = 0;
    answerLocked = false;
    quizFinished = false;
    startTime = Date.now();

    // Update question totals for the chosen difficulty.
    $("introQuestionCount").textContent = questions.length;

    showScreen(quizScreen);
    createProgressSegments();
    displayQuestion();
    startTimer();
}

// ========================================
// 6. CREATE SEGMENTED PROGRESS BAR
// ========================================

function createProgressSegments() {
    const bar = $("segmentedProgress");

    bar.innerHTML = "";

    bar.setAttribute("aria-valuemax", questions.length);

    questions.forEach((question, index) => {
        const segment = document.createElement("span");

        segment.className = "progress-segment";
        segment.dataset.index = index;

        bar.appendChild(segment);
    });

    updateProgress();
}

function updateProgress() {
    const total = questions.length;

    const percentage = Math.round(
        ((currentQuestion + 1) / total) * 100
    );

    $("questionProgress").textContent =
        `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${total}`;

    $("progressPercentage").textContent =
        `${percentage}% completed`;

    $("questionNumber").textContent =
        `${String(currentQuestion + 1).padStart(2, "0")} / ${total}`;

    $("segmentedProgress").setAttribute(
        "aria-valuenow",
        currentQuestion + 1
    );

    [...$("segmentedProgress").children].forEach((segment, index) => {
        segment.className = "progress-segment";

        if (userAnswers[index]) {
            segment.classList.add(
                userAnswers[index].correct
                    ? "correct"
                    : "incorrect"
            );
        } else if (index === currentQuestion) {
            segment.classList.add("current");
        }
    });
}

// ========================================
// 7. DISPLAY A QUESTION
// ========================================

function displayQuestion() {
    answerLocked = false;
    timeLeft = 15;

    $("timer").textContent = `${timeLeft}s`;
    $("timerBox").classList.remove("urgent");

    $("answerFeedback").className = "answer-feedback hidden";
    $("answerFeedback").textContent = "";

    $("answerStatus").textContent = "SELECT ONE OPTION";
    $("nextButton").disabled = true;

    const question = questions[currentQuestion];

    $("category").textContent = question.category;
    $("questionText").textContent = question.question;

    $("nextButton").innerHTML =
        currentQuestion === questions.length - 1
            ? 'See my results <span>↗</span>'
            : 'Next question <span>→</span>';

    const optionsContainer = $("answerOptions");

    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "option-button";

        const letter = document.createElement("span");
        letter.className = "option-letter";
        letter.textContent = letters[index];

        const text = document.createElement("span");
        text.textContent = option;

        button.append(letter, text);

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        optionsContainer.appendChild(button);
    });

    updateProgress();
}

// ========================================
// 8. COUNTDOWN TIMER
// ========================================

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (answerLocked || quizFinished) {
            clearInterval(timerInterval);
            return;
        }

        timeLeft--;

        $("timer").textContent = `${timeLeft}s`;

        if (timeLeft <= 5) {
            $("timerBox").classList.add("urgent");
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectAnswer(-1, true);
        }
    }, 1000);
}

// ========================================
// 9. CHECK THE SELECTED ANSWER
// ========================================

function selectAnswer(selectedIndex, timedOut = false) {
    if (answerLocked || quizFinished) return;

    answerLocked = true;
    clearInterval(timerInterval);

    const question = questions[currentQuestion];
    const isCorrect = selectedIndex === question.answer;

    if (isCorrect) {
        score++;
    }

    userAnswers[currentQuestion] = {
        selected: selectedIndex,
        correct: isCorrect,
        timedOut
    };

    const optionButtons = [...$("answerOptions").children];

    optionButtons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct-answer");
        }

        if (index === selectedIndex && !isCorrect) {
            button.classList.add("wrong-answer");
        }
    });

    const feedback = $("answerFeedback");

    feedback.className =
        `answer-feedback ${isCorrect ? "good" : "bad"}`;

    if (timedOut) {
        feedback.textContent =
            `Time is up! ${question.explanation}`;
    } else if (isCorrect) {
        feedback.textContent =
            `Correct! ${question.explanation}`;
    } else {
        feedback.textContent =
            `Not quite. ${question.explanation}`;
    }

    $("answerStatus").textContent = isCorrect
        ? "NICE WORK — CORRECT"
        : timedOut
            ? "TIME RAN OUT"
            : "ANSWER REVIEW";

    $("nextButton").disabled = false;

    updateProgress();
}

// ========================================
// 10. MOVE TO THE NEXT QUESTION
// ========================================

function nextQuestion() {
    if (!answerLocked || quizFinished) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;

        displayQuestion();
        startTimer();
    } else {
        finishQuiz();
    }
}

// ========================================
// 11. FORMAT TIME
// ========================================

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ========================================
// 12. FINISH AND SHOW RESULTS
// ========================================

function finishQuiz() {
    if (quizFinished) return;

    quizFinished = true;
    clearInterval(timerInterval);

    totalTime = Math.floor(
        (Date.now() - startTime) / 1000
    );

    showScreen(resultScreen);

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    $("scorePercentage").textContent = `${percentage}%`;

    $("scoreRing").style.setProperty(
        "--score",
        `${percentage}%`
    );

    $("correctAnswers").textContent = score;
    $("wrongAnswers").textContent = total - score;
    $("timeTaken").textContent = formatTime(totalTime);

    $("resultEmoji").textContent =
        percentage >= 80 ? "🏆" :
        percentage >= 50 ? "🌟" : "🌱";

    $("resultTitle").textContent =
        percentage >= 80 ? "Brilliant work!" :
        percentage >= 50 ? "Look at you, learning!" :
        "Every expert starts somewhere.";

    $("resultMessage").textContent =
        `You answered ${score} out of ${total} questions correctly.`;

    displayAnswerReview();
}

// ========================================
// 13. DISPLAY ANSWER REVIEW
// ========================================

function displayAnswerReview() {
    const review = $("answerReview");

    review.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "YOUR ROUND AT A GLANCE";

    review.appendChild(heading);

    questions.forEach((question, index) => {
        const answer = userAnswers[index];

        const row = document.createElement("div");
        row.className = "review-row";

        const category = document.createElement("span");

        category.textContent =
            `${String(index + 1).padStart(2, "0")}. ${question.category}`;

        const result = document.createElement("strong");

        result.textContent = answer.correct
            ? "✓ Correct"
            : "× Incorrect";

        result.style.color = answer.correct
            ? "#25b88d"
            : "#e46b81";

        row.append(category, result);
        review.appendChild(row);
    });
}

// ========================================
// 14. DOWNLOAD RESULTS AS A PDF
// ========================================

function downloadPDF() {
    if (!window.jspdf) {
        alert(
            "The PDF library could not load. Check your internet connection and try again."
        );
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const percentage = Math.round(
        (score / questions.length) * 100
    );

    // PDF header
    pdf.setFillColor(113, 83, 225);
    pdf.rect(0, 0, 210, 38, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("MYQUIZ-APP", 16, 17);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("INTERACTIVE QUIZ / RESULTS REPORT", 16, 27);

    // Summary
    pdf.setTextColor(40, 35, 70);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Your Quiz Results", 16, 52);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(
        `Score: ${score}/${questions.length} (${percentage}%)`,
        16,
        63
    );

    pdf.text(
        `Correct: ${score} | Incorrect: ${questions.length - score}`,
        16,
        71
    );

    pdf.text(`Time used: ${formatTime(totalTime)}`, 16, 79);

    pdf.setDrawColor(220, 215, 240);
    pdf.line(16, 85, 194, 85);

    // Question-by-question review
    let y = 96;

    questions.forEach((question, index) => {
        const answer = userAnswers[index];

        const questionLines = pdf.splitTextToSize(
            `${index + 1}. ${question.question}`,
            174
        );

        const chosenAnswer =
            answer.selected >= 0
                ? question.options[answer.selected]
                : "No answer — time expired";

        const answerLines = pdf.splitTextToSize(
            `Your answer: ${chosenAnswer}`,
            170
        );

        const correctLines = pdf.splitTextToSize(
            `Correct answer: ${question.options[question.answer]}`,
            170
        );

        const explanationLines = pdf.splitTextToSize(
            `Explanation: ${question.explanation}`,
            170
        );

        const requiredHeight =
            questionLines.length * 5 +
            answerLines.length * 5 +
            correctLines.length * 5 +
            explanationLines.length * 4.5 + 12;

        if (y + requiredHeight > 275) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(40, 35, 70);

        pdf.text(questionLines, 16, y);
        y += questionLines.length * 5 + 2;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(70, 68, 95);

        pdf.text(answerLines, 19, y);
        y += answerLines.length * 5 + 1;

        pdf.setTextColor(30, 135, 100);
        pdf.text(correctLines, 19, y);
        y += correctLines.length * 5 + 1;

        pdf.setTextColor(110, 105, 130);
        pdf.text(explanationLines, 19, y);
        y += explanationLines.length * 4.5 + 8;
    });

    // Save the PDF file
    pdf.save("MyQuiz-App-Results.pdf");
}

// ========================================
// 15. DARK AND LIGHT MODE
// ========================================

$("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const darkMode = document.body.classList.contains("dark");

    $("themeToggle").textContent = darkMode ? "☀" : "☾";

    $("themeToggle").setAttribute(
        "aria-label",
        darkMode ? "Switch to light mode" : "Switch to dark mode"
    );

    $("themeToggle").title =
        darkMode ? "Switch to light mode" : "Switch to dark mode";
});

// ========================================
// 16. CONNECT ALL BUTTONS
// ========================================

$("startButton").addEventListener("click", startQuiz);

$("nextButton").addEventListener("click", nextQuestion);

$("downloadPDF").addEventListener("click", downloadPDF);

$("playAgain").addEventListener("click", () => {
    clearInterval(timerInterval);
    showScreen(welcomeScreen);
});

$("exitButton").addEventListener("click", () => {
    clearInterval(timerInterval);
    showScreen(welcomeScreen);
});

// Set the initial question count.
$("introQuestionCount").textContent = 10;
