$(document).ready(() => {
  $("body").append(
    `<div class='center start'>
      <button id='start-btn'>START JEOPARDY</button>
     </div>
     <div class='start' id='auto-start'>Game automatically starts in...10</div>`
  );
  $("#start-btn").on("click", () => {
    $(".start").remove();
    setupAndStart();
  });
  autoStartGame();
});

// Display count down and automatically start game after 10 seconds
const autoStartGame = () => {
  let counter = 9;
  const interval = setInterval(() => {
    // Clear interval if element does not exist (ie button was clicked)
    if (!document.querySelector("#auto-start")) {
      clearInterval(interval);
    } else if (counter === 0) {
      $(".start").remove();
      setupAndStart();
      clearInterval(interval);
    } else {
      document.querySelector(
        "#auto-start"
      ).innerText = `Game automatically starts in...${counter}`;
      counter--;
    }
  }, 1000);
};

let categoryIds = [];
let categoryNames = [];
const height = 6;
const width = 5;
const getRandom = _.sampleSize;

// Get categories from API and
// return array of 6 random category IDs
// and array of their respective category names
const getCategoryIdsAndNames = async () => {
  try {
    const categories = await axios.get("https://jservice.io/api/categories", {
      params: {
        count: 100,
      },
    });
    const numCategories = getRandom(categories.data, 6);

    for (const category of numCategories) {
      categoryIds.push(category.id);
      categoryNames.push(category.title);
    }
    return [categoryIds, categoryNames];
  } catch (error) {
    console.log(error);
  }
};

// Return category information based on category ID
const getCategoryClues = async (categoryId) => {
  try {
    const categoryData = await axios.get("https://jservice.io/api/category", {
      params: {
        id: categoryId,
      },
    });
    const numQuestionsPerCat = getRandom(categoryData.data.clues, 5);
    return numQuestionsPerCat;
  } catch (error) {
    console.log(error);
  }
};

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

const fillTable = (clues) => {
  $("body").append(`
    <table>
      <thead>
        <tr class="header"></tr>
      </thead>
      <tbody></tbody>
    </table>`);

  // Populates header for category names
  for (const name of categoryNames) {
    $(".header").append(`
      <td class="header-td">${name.toUpperCase()}</td>
    `);
  }

  // Creates rows and cells with unique ids
  for (let i = 0; i < height - 1; i++) {
    $("tbody").append(`<tr id="${i}"></tr>`);
    for (let j = 0; j <= width; j++) {
      $(`#${i}`).append(`<td class="question-mark"id="${j}-${i}">?</td>`);
    }
  }

  // Handle click on non-header tds
  $("tbody td").on("click", (e) => {
    handleClick(e, clues);
  });
};

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses various classes to determine what to show:
 * - if currently "question-mark", show question & set className to "question"
 * - if currently "question", show answer & set className to "answer"
 * - if currently "answer", ignore click
 * */

const handleClick = (e, clues) => {
  const column = Number(e.target.id[0]);
  const row = Number(e.target.id[2]);

  let text;
  if (e.target.className === "question-mark") {
    e.target.className = "question";
    text = clues[column][row].question;
  } else if (e.target.className === "question") {
    e.target.className = "answer";
    text = clues[column][row].answer;
    e.target.style.pointerEvents = "none";
  }

  e.target.innerHTML = text;
};

// Resets the board and reset button
const resetBoardAndButton = () => {
  $("#new-btn").on("click", () => {
    categoryIds = [];
    categoryNames = [];
    $("table").remove();
    $("#new-btn").remove();
    setupAndStart();
  });
};

/** Setup and start game:
 *
 * - start loading spinner
 * - get random category Ids
 * - get data for each category
 * - create HTML table & append data to DOM
 * - remove loading spinner & append reset button
 * */

const setupAndStart = async () => {
  $("body").append("<div id='busy'></div>");

  await getCategoryIdsAndNames();

  // Array of promises to get clues for each category id
  const promisesArray = categoryIds.map((id) => getCategoryClues(id));
  const allClues = await Promise.all(promisesArray);

  // Append to DOM when start button clicked
  fillTable(allClues);
  $("body").append(
    "<div class='center'><button id='new-btn'>NEW GAME</button></div>"
  );

  $("#busy").remove();
  resetBoardAndButton();
};
