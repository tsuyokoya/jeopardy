// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

const getCategoryIds = async () => {
  const categoriesArray = await axios
    .get("http://jservice.io/api/categories", {
      params: {
        count: 100,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  const NUM_CATEGORIES = _.sampleSize(categoriesArray, 6);

  for (const category of NUM_CATEGORIES) {
    categories.push(category.id);
  }

  console.log(categories);
  return categories;
};

getCategoryIds();

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

const getCategory = async (catId) => {
  const categoryData = await axios
    .get("http://jservice.io/api/category", {
      params: {
        id: catId,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  const NUM_QUESTIONS_PER_CAT = _.sampleSize(categoryData.clues, 5);
  console.log(NUM_QUESTIONS_PER_CAT);
  return NUM_QUESTIONS_PER_CAT;
};

getCategory(2);

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

const fillTable = async () => {};

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

const handleClick = (evt) => {};

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

const showLoadingView = () => {};

/** Remove the loading spinner and update the button used to fetch data. */

const hideLoadingView = () => {};

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

const setupAndStart = async () => {};

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
