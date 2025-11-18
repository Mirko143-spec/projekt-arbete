
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
const nextBtn = document.getElementById("nextBtn");

async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
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
    let currQuestion = 0;

    // Fetchar frågor/svar från API och Startar quizzen
    let data = await fetchQuestions();
    loadQuestion(data);
}

async function loadQuestion(data) {

    // Döljer correct och incorrect div
    incorrectContainer.style.display = 'none';
    correctContainer.style.display = 'none';

    // Slumpar fram ett nummer mellan 1 - 10
    let randomInt = Math.floor(Math.random() * 10);
    
    // Väljer fråga utifrån det slumpade numret
    let question = data[randomInt].question;
    questionElement.innerHTML = question;

    // Gör en variabel för rätt svar utifrån det slumpade numret
    let correctAnswer = data[randomInt].correct_answer;

    // Lägger in alla "fel svar" i en array
    let answers = [];
    for (item of data[randomInt].incorrect_answers) {
        answers.push(item);
    }

    // Slumpar fram en position i arrayen och lägger till rätt svar på den slumpade positionen.
    let randomPos =  Math.floor(Math.random() * (answers.length + 1));
    answers.splice(randomPos, 0, correctAnswer);

    // Laddar in hela arrayen till svar sektionen på sidan
    for (i=0;i<answersContainer.children.length;i++) {
        answersContainer.children[i].children[0].children[1].innerText = answers[i];
    }

// Viktiga variabler som skapas här
    // data - för nuvarande JSON datan som används i quizen 
    // question - för nuvarande frågan i quizen 
    // correctAnswer - för korrekt svar till nuvarande frågan i quizen

}
initQuiz()



//Timer 

//question box + question bar

//quiz div

//section box --> score bar

//hidden incorrect <--> correct answer

//next question effect


