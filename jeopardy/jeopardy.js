let categoryIds = [];
let categoryNames = [];

// Get categories from API and
// return array of 6 random category IDs
// and array of their respective category names
const getCategoryIdsAndNames = async () => {
  const categoriesArray = await axios
    .get("http://jservice.io/api/categories", {
      params: {
        count: 100,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  const NUM_CATEGORIES = _.sampleSize(categoriesArray, 6);

  for (const category of NUM_CATEGORIES) {
    categoryIds.push(category.id);
    categoryNames.push(category.title);
  }
  return [categoryIds, categoryNames];
};

// Return category information based on category ID
const getCategoryClues = async (categoryId) => {
  const categoryData = await axios
    .get("http://jservice.io/api/category", {
      params: {
        id: categoryId,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  const NUM_QUESTIONS_PER_CAT = _.sampleSize(categoryData.clues, 5);
  return NUM_QUESTIONS_PER_CAT;
};

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

const height = 6;
const width = 5;

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
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
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

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

const showLoadingView = () => {
  // Remove loading spinner & add button for new game
  $("body").append("<div id='busy'></div>");
};

/** Remove the loading spinner and update the button used to fetch data. */

const hideLoadingView = () => {
  $("#busy").remove();
};

const resetBoardAndButton = () => {
  $("#new-btn").on("click", () => {
    categoryIds = [];
    categoryNames = [];
    $("table").remove();
    $("#new-btn").remove();
    setupAndStart();
  });
};

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

const setupAndStart = async () => {
  showLoadingView();

  const categoryIdsAndNames = await getCategoryIdsAndNames();
  const clues = [];

  // For each category ID, get category details
  for (const categoryId of categoryIdsAndNames[0]) {
    clues.push(await getCategoryClues(categoryId));
  }

  // Append to DOM when start button clicked
  fillTable(clues);
  $("body").append(
    "<div class='center'><button id='new-btn'>NEW GAME</button></div>"
  );
  hideLoadingView();
  resetBoardAndButton();
};

$(document).ready(() => {
  $("body").append(
    "<div class='center start'><button id='start-btn'>START JEOPARDY</button></div>"
  );
  $("#start-btn").on("click", () => {
    $(".start").remove();
    setupAndStart();
  });
});
