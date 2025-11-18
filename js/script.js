//Timer

//question box + question bar

//quiz div

//section box --> score bar

//hidden incorrect <--> correct answer

//next question effect

async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}
