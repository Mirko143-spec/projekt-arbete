
//Timer elementet
const timerElement = document.getElementById('timer');

//Frågenummer (Question 1/10)
const questionNmb = document.getElementById('questionNmb');

//Horisontell progressbar
const pBarHorizontal = document.getElementById('questionBar');

//Frågor och svar
const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers');

// Vertikal progressbar (samt poängbaren brevid)
const pBarVertical = document.getElementById('pointsBar');
const pNmbVertical = document.getElementById('points');

// Correct / Incorrect meddelande
const correctContainer = document.getElementById('correct');
const incorrectContainer = document.getElementById('incorrect');
const incorrectText = document.getElementById('incorrectText');

async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

async function initQuiz() {
    // Nollställer spel variabler
    let timer = 0;
    let points = 0;
    let currQuestion = 1;

    // Döljer correct och incorrect div
    incorrectContainer.style.display = 'none';
    correctContainer.style.display = 'none';

    // Fetchar frågor/svar från API och Startar quizzen
    let data = await fetchQuestions();
    startQuiz(data);
}

//Timer 

//question box + question bar

//quiz div

//section box --> score bar

//hidden incorrect <--> correct answer

//next question effect

