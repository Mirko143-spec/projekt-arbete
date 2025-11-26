//Frågenummer (Question 1/10)
const questionNmb = document.getElementById("questionNmb");

//Horisontell progressbar
const pBarHorizontal = document.getElementById("questionBar");

//Frågor och svar
const questionElement = document.getElementById("question");
const answersContainer = document.getElementById("answers");

// Vertikal progressbar (samt poängbaren brevid)
const pBarVertical = document.getElementById("pointsBar");
const pNmbVertical = document.getElementById("points");

// Correct / Incorrect meddelande
const correctContainer = document.getElementById("correct");
const incorrectContainer = document.getElementById("incorrect");
const incorrectText = document.getElementById("incorrectText");
const nextBtn = document.getElementById("nextBtn");

//Result modal
const modal = document.getElementById("result");
const modalScore = document.getElementById("result-score");

let timer;
let points;
let currQuestion;
let data = [];
let locked = false;
let currentCorrectAnswer = null;
let playerName;
let category;
let difficulty;
let userconsent = false;

const playerNameInput = document.getElementById("playerName");
const categorySelect = document.getElementById("trivia_category");
const difficulties = document.getElementById("trivia_difficulty");
const dialog = document.getElementById("startDialog");
const startButton = document.getElementById("startButton");

const termsdialog = document.getElementById("termsConditions");
const condYes = document.getElementById("condYes");
const condNo = document.getElementById("condNo");

// Globala variabler

// Timer variabler



const clock = document.getElementById("clock");

function handleclick(e) {
  if (e.target.id === "condYes") {

    userconsent = true;
    termsdialog.close();
    dialog.showModal();
    dialog.style.display = "flex";
    //insert function where the gtag will be
  } else if (e.target.id === "condNo") {
    termsdialog.close();
    dialog.showModal();
    dialog.style.display = "flex";
  }
}

condYes.addEventListener("click", handleclick);
condNo.addEventListener("click", handleclick);
window.addEventListener("load", () => termsdialog.showModal());

startButton.addEventListener("click", async () => {
  // Info som sparas med inputsession();
  playerName = playerNameInput.value.trim();
  category = categorySelect.value;
  difficulty = difficulties.value;
  modal.close();

  // Bygg URL
  let url = `https://opentdb.com/api.php?amount=10`;
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}&type=multiple`;

  console.log("Fetching questions from:", url);

  // HÄMTA frågorna
  data = await fetchQuestions(url);
  console.log("Questions:", data);

  if (!data || data.length === 0) {
    alert("Kunde inte hämta frågor, testa andra inställningar.");
    return;
  }

  dialog.style.display = "none";

  // Starta quiz nu när data är fylld
  initQuiz();
});

function inputSession() {
  if (!playerName || playerName.trim() === "") {
    playerName = "Player 1";
  }

  // 1. Get existing sessions array (or start empty)
  const existingSessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  // 2. Build the session object
  const sessionData = {
    name: playerName,
    category,
    difficulty,
    points,
    date: new Date().toISOString(),
  };

  // 4. Push it into the array
  existingSessions.push(sessionData);

  // 5. Save the array back to sessionStorage
  localStorage.setItem("sessions", JSON.stringify(existingSessions));

    if (userconsent && typeof window.gtag === "function") {
      gtag("event", "quiz_complete", {
      player_name: sessionData.name,
      category: sessionData.category || "any",
      difficulty: sessionData.difficulty || "any",
      score: sessionData.points,
      question_count: 10,
    });
    console.log("chavez engineering");
  }

  fillLeaderboard();
}

let timeLeft = 15;
let timerInterval;
const timerElement = document.getElementById("timer");

function startTimer() {
  clock.src = "./img/clock-blue.svg";
  clearInterval(timerInterval);
  timeLeft = 15;
  timerElement.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }

    if (timeLeft < 6) {
      clock.src = "./img/clock-red.svg";
      clock.classList.add("animate__animated", "animate__flip");
    }
  }, 1000);
}

function handleTimeout() {
  locked = true;
  incorrectText.innerHTML = `⏰ Time's up! The correct answer was: ${currentCorrectAnswer}`;
  incorrectContainer.style.display = "block";
  answersContainer.style.pointerEvents = "none";
}

async function fetchQuestions(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

async function initQuiz() {
  // Nollställer spel variabler
  timer = 0;
  points = 0;
  currQuestion = 1;
  pBarHorizontal.value = 10;
  // Fetchar frågor/svar från API och Startar quizzen
  loadQuestion();
}

async function loadQuestion() {
  // Döljer correct och incorrect div
  incorrectContainer.style.display = "none";
  correctContainer.style.display = "none";

  // Slumpar fram ett nummer mellan 1 - 10
  let randomInt = Math.floor(Math.random() * data.length);

  // Väljer fråga utifrån det slumpade numret
  let question = data[randomInt].question;
  questionElement.innerHTML = question;

  // Gör en variabel för rätt svar utifrån det slumpade numret
  let correctAnswer = data[randomInt].correct_answer;
  currentCorrectAnswer = correctAnswer;

  // Lägger in alla "fel svar" i en array
  let answers = [];
  for (item of data[randomInt].incorrect_answers) {
    answers.push(item);
  }

  // Tar bort den använda frågan från datan så den inte kan användas igen
  data.splice(randomInt, 1);

  // Slumpar fram en position i arrayen och lägger till rätt svar på den slumpade positionen.
  let randomPos = Math.floor(Math.random() * (answers.length + 1));
  answers.splice(randomPos, 0, correctAnswer);

  // Laddar in hela arrayen till svar sektionen på sidan
  for (i = 0; i < answersContainer.children.length; i++) {
    answersContainer.children[i].children[0].children[1].innerHTML = answers[i];
  }
  startTimer();
}

function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    // Visa correct div
    correctContainer.style.display = "block";
    updateScore(100);
  } else {
    // Visa incorrect div + rätt svar
    incorrectText.innerHTML = `❌ Incorrect. The correct answer was: ${correctAnswer}`;
    incorrectContainer.style.display = "block";
  }
}

answersContainer.addEventListener("click", function (e) {
  if (locked) return;
  locked = true;
  answersContainer.style.pointerEvents = "none";

  if (
    e.target &&
    (e.target.nodeName === "P" ||
      e.target.nodeName === "SPAN" ||
      e.target.nodeName === "LI")
  ) {
    let selectedAnswer;
    let answerDiv;
    if (e.target.nodeName === "P") {
      selectedAnswer = e.target.innerText;
      answerDiv = e.target.parentNode.parentNode;
    } else if (e.target.nodeName === "SPAN") {
      selectedAnswer = e.target.children[0].innerText;
      answerDiv = e.target.parentNode.parentNode;
    } else {
      selectedAnswer = e.target.children[0].children[1].innerText;
      answerDiv = e.target;
    }

    // Kollar om svaret är rätt isåfall färgas det GRÖNT
    if (selectedAnswer === currentCorrectAnswer) {
      answerDiv.style.backgroundColor = "rgba(0, 201, 80, 0.5)";
      clearInterval(timerInterval);
    } else {
      // Färgar det valda svaret RÖTT
      answerDiv.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      clearInterval(timerInterval);
      // Färgar det RÄTTA svaret GRÖNT
      for (const answer of answersContainer.children) {
        if (answer.children[0].children[1].innerText === currentCorrectAnswer) {
          answer.style.backgroundColor = "rgba(0, 201, 80, 0.5)";
        }
      }
    }
    checkAnswer(selectedAnswer, currentCorrectAnswer);
  }
});

const finish = document.getElementById("finish");
finish.addEventListener("click", () => {
  clearInterval(timerInterval);
  modal.showModal();
  modalScore.innerText = `Ditt resultat blev ${points} poäng!`;
  inputSession();
});

nextBtn.addEventListener("click", async (e) => {
  currQuestion++;
  locked = false;

  if (currQuestion > 9) {
    nextBtn.style.display = "none";
    finish.style.display = "flex";
  }
  // Tar bort den använda frågan från datan så den inte kan användas igen
  if (currQuestion !== 11) {
    // FUNKAR EJ - PLS MAGYSTR MIRAN FIX
    loadQuestion();
    answersContainer.style.pointerEvents = "auto";
    for (const answer of answersContainer.children) {
      answer.style.backgroundColor = "transparent";
      answer.children[0].children[1].style.backgroundColor = "transparent";
    }
    questionNmb.innerText = `Question ${currQuestion}/10`;
  } else {
  }
  pBarHorizontal.value = currQuestion * 10;
  startTimer();
});

function updateScore(pointsToAdd) {
  points += pointsToAdd;
  pNmbVertical.innerText = `${points} pts`;
  pBarHorizontal.value += pointsToAdd / 10;
  pBarVertical.value += pointsToAdd / 10;
  let pBarMargin = 398;
  pBarMargin = pBarMargin - (points / 10) * 3.98;
  pNmbVertical.style.marginTop = `${pBarMargin}px`;
}

//save
function fillLeaderboard(selectedDifficulty = "all") {
  if (!selectedDifficulty) selectedDifficulty = "all";

  // always read fresh data
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  const rack = document.getElementById("scoreboard");
  rack.innerHTML = ""; // clear old items

  // normalize
  selectedDifficulty = selectedDifficulty.toLowerCase();

  const filtered = sessions.filter(function (s) {
    if (selectedDifficulty === "all") return true;

    return s.difficulty === selectedDifficulty;
  });

  filtered.sort(function (a, b) {
    return b.points - a.points;
  });

  filtered.forEach(function (s) {
    const li = document.createElement("li");

    if (selectedDifficulty === "all") {
      // Show difficulty tag only when viewing ALL results
      li.textContent = `${s.points} points - ${s.name} (${s.difficulty})`;
    } else {
      // When filtering by a single difficulty, don't show it
      li.textContent = `${s.points} points - ${s.name}`;
    }

    rack.appendChild(li);
  });
}

function populateDifficultySelect() {
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  const select = document.getElementById("selectdiff");

  // remove all options except the first "All"
  while (select.options.length > 1) {
    select.remove(1);
  }

  // unique difficulties
  const difficulties = [...new Set(sessions.map((s) => s.difficulty))];

  difficulties.forEach(function (diff) {
    const option = document.createElement("option");
    option.value = diff.toLowerCase(); // value used in filter
    option.textContent = diff.charAt(0).toUpperCase() + diff.slice(1); // label for user
    select.appendChild(option);
  });
}
const select = document.getElementById("selectdiff");

document.addEventListener("DOMContentLoaded", function () {
  // populate dropdown and initial leaderboard
  populateDifficultySelect();
  fillLeaderboard("all");

  // change filter when user picks difficulty
  select.addEventListener("change", function () {
    fillLeaderboard(select.value);
    //"all", "easy", "medium", etc.
  });
});

function saveSession(sessionData) {
  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
  sessions.push(sessionData);
  localStorage.setItem("sessions", JSON.stringify(sessions));

  populateDifficultySelect();

  const currentSelect = document.getElementById("selectdiff");
  fillLeaderboard(currentSelect.value || "all");
}

const popupleader = document.getElementById("popupleader");
const leaderboardmodal = document.getElementById("leaderboard");

function restartQuiz() {
  questionNmb.innerText = `Question 1/10`;
  leaderboardmodal.close();
  modal.close();
  dialog.showModal();
  dialog.style.display = "flex";
  nextBtn.style.display = "flex";
  finish.style.display = "none";
  clearInterval(timerInterval);
  initQuiz();
}

popupleader.addEventListener("click", function () {
  modal.close();
  leaderboardmodal.showModal();
  clearInterval(timerInterval);
});

startButton.addEventListener("click", () => modal.close());
