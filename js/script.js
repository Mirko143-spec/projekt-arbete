//Timer elementet
const timerElement = document.getElementById("timer");

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

async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
    );

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

  // Fetchar frågor/svar från API och Startar quizzen
  data = await fetchQuestions();
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
  data.splice(randomInt, 1) 

  // Slumpar fram en position i arrayen och lägger till rätt svar på den slumpade positionen.
  let randomPos = Math.floor(Math.random() * (answers.length + 1));
  answers.splice(randomPos, 0, correctAnswer);

  // Laddar in hela arrayen till svar sektionen på sidan
  for (i = 0; i < answersContainer.children.length; i++) {
    answersContainer.children[i].children[0].children[1].innerHTML = answers[i];
  }
}

function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    // Visa correct div
    correctContainer.style.display = "block";
    updateScore(100);
  } else {
    // Visa incorrect div + rätt svar
    incorrectText.innerText = `❌ Incorrect. The correct answer was: ${correctAnswer}`;
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
    } else {
      // Färgar det valda svaret RÖTT
      answerDiv.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
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

nextBtn.addEventListener("click", async (e) => {
  currQuestion++;
  locked = false;
  // Tar bort den använda frågan från datan så den inte kan användas igen
  if (currQuestion == 11) {
    modal.showModal();
    modalScore.innerText = `Ditt resultat blev ${points} poäng!`;
  } else {
    loadQuestion();
    answersContainer.style.pointerEvents = "auto";
    for (const answer of answersContainer.children) {
      answer.style.backgroundColor = "transparent";
      answer.children[0].children[1].style.backgroundColor = "transparent";
    }
    questionNmb.innerText = `Question ${currQuestion}/10`;
  }
  pBarHorizontal.value = currQuestion * 10;
});

initQuiz();

function updateScore(pointsToAdd) {
  points += pointsToAdd;
  pNmbVertical.innerText = `${points} pts`;
  pBarHorizontal.value += pointsToAdd / 10;
  pBarVertical.value += pointsToAdd / 10;
  let pBarMargin = 398;
  pBarMargin = pBarMargin - (points / 10) * 3.98;
  pNmbVertical.style.marginTop = `${pBarMargin}px`;
}

//Timer

// Uppgifter:

// currentQuestionIndex++

// Visa nästa fråga eller visa resultatskärm

// Återställ UI (ta bort “Correct!” / “Incorrect!”)

// Hantera quizets slut (t.ex. visa totalpoäng, restart-knapp)

// Beroende: Ticket 3, 4, 5
// Ansvar: Flöde / Navigering
