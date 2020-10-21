/******************************************************************************
**  Description: QUIZ BUILDER PAGE - client side javascript file that creates
**               a quiz dynamically and submits the form to the server
******************************************************************************/

// Enable navigation prompt for leaving page early
window.onbeforeunload = function() {
    return true;
};

// Declare an empty quiz object
let quiz = {};

// Parse the url for the quiz setup
const urlParams = new URLSearchParams(window.location.search);

// Enter the quiz setup values into the quiz object
quiz.title = urlParams.get('quiz_title');
quiz.category = urlParams.get('category');
quiz.limit = urlParams.get('time_limit');

console.log(quiz);


// Target button ids
let trueFalseBtn = document.getElementById('true_false_btn');
let multBtn = document.getElementById('multiple_c_btn');
let fillInBtn = document.getElementById('fill_in_btn');
let checkAllBtn = document.getElementById('choose_all_btn');

// Target quiz form
let quiz_form = document.getElementById('quiz_form');

// TRUE/FALSE BUTTON - Function to create true false question -----------------
trueFalseBtn.addEventListener('click', (e) => {
    let unique_question = document.createElement("input");
    unique_question.placeholder = 'Enter Question';
    unique_question.className = 'question_input';
    quiz_form.appendChild(unique_question);

    // Hide the question selection buttons
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';

    let completeBtn = document.createElement('button');
    completeBtn.className = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored';
    completeBtn.textContent = 'Complete Question';
    quiz_form.appendChild(completeBtn);
})


// MULTIPLE CHOICE BUTTON - Function to create mult choice question -----------
multBtn.addEventListener('click', (e) => {
    let unique_question = document.createElement("input");
    unique_question.placeholder = 'Enter Question';
    unique_question.className = 'question_input';
    quiz_form.appendChild(unique_question);


})

// CHECK ALL THAT APPLY - Function to create check all question ---------------
fillInBtn.addEventListener('click', (e) => {
    let unique_question = document.createElement('input');
    unique_question.placeholder = 'Enter Question';
    unique_question.className = 'question_input';
    quiz_form.appendChild(unique_question);


})

// FILL IN THE BLANK - Function to create fill in blank question --------------
checkAllBtn.addEventListener('click', (e) => {
    let unique_question = document.createElement("input");
    unique_question.placeholder = 'Enter Question';
    unique_question.className = 'question_input';
    quiz_form.appendChild(unique_question);


})


// QUIZ FORM SUBMISSION - Function to submit the quiz on completion
quiz_form.addEventListener('submit', (err) => {
    err.preventDefault();

    // Remove navigation prompt on form submission
    window.onbeforeunload = null;


})
