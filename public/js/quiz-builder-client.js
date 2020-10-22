/******************************************************************************
**  Description: QUIZ BUILDER PAGE - client side javascript file that creates
**               a quiz dynamically and submits the form to the node server
**               POST route /quiz_create/submit_quiz
******************************************************************************/

// Enable navigation prompt for leaving page early
window.onbeforeunload = () => {
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
quiz.questions = [];

console.log(quiz);

// Global iterator for question count (Must be 1+ to submit quiz)
let QUESTION_COUNT = 0;

// Target button ids
let trueFalseBtn = document.getElementById('true_false_btn');
let multBtn = document.getElementById('multiple_c_btn');
let fillInBtn = document.getElementById('fill_in_btn');
let checkAllBtn = document.getElementById('choose_all_btn');

// Target quiz form
let quiz_form = document.getElementById('quiz_form');

// TRUE/FALSE BUTTON - Function to create true false question -----------------
trueFalseBtn.addEventListener('click', (e) => {
    // Hide the question selection buttons and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';

    // Display question number
    let questionNum = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${++QUESTION_COUNT}`;
    quiz_form.appendChild(questionNum);

    // Create the question input
    let questionBox = document.createElement('input');
    questionBox.placeholder = 'Enter Question';
    questionBox.id          = 'questionBox';
    questionBox.className   = 'question_input';
    quiz_form.appendChild(questionBox);

    // Create true radio button
    let trueRadio = document.createElement('input');
    trueRadio.type   = 'radio';
    trueRadio.id     = 'true-radio';
    trueRadio.value  = 'True';
    trueRadio.name   = 'true-false';

    // Create false radio button
    let falseRadio = document.createElement('input');
    falseRadio.type   = 'radio';
    falseRadio.id     = 'false-radio';
    falseRadio.value  = 'False';
    falseRadio.name   = 'true-false';
    
    // Label the buttons
    let labelTrue = document.createElement('label');
    let labelFalse = document.createElement('label');
    labelTrue.htmlFor = 'true-radio';
    labelFalse.htmlFor = 'false-radio';
    
    // Create text descriptions
    let descriptionTrue = document.createTextNode('True');
    let descriptionFalse = document.createTextNode('False');
    labelTrue.appendChild(descriptionTrue);
    labelFalse.appendChild(descriptionFalse);
    
    // Add the buttons to the DOM
    let newline = document.createElement('br');
    let container = document.getElementById('quiz_form');
    container.appendChild(trueRadio);
    container.appendChild(labelTrue);
    container.appendChild(newline);
    container.appendChild(falseRadio);
    container.appendChild(labelFalse);
    container.appendChild(newline);

    // Show the question complete button
    let completeBtn = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    quiz_form.appendChild(completeBtn);

    // Event handler to register the new question
    completeBtn.addEventListener('click', (err) => {
        // Input validation to require values for question and answer
        questionBox.required = true;
        trueRadio.required = 'true';

        // Check whether true or false
        let tfValue;
        if (document.getElementById("true-radio").checked) {
            tfValue = true;
        } else {
            tfValue = false;
        }

        // Create question object
        let obj = {
            quizQuestion: questionBox.value,
            quizAnswers: tfValue
        }
    
        // Insert the question object into the quiz object
        quiz.questions.push(obj);
        console.log(quiz);
    });
});


// MULTIPLE CHOICE BUTTON - Function to create mult choice question -----------
multBtn.addEventListener('click', (e) => {
    let questionBox = document.createElement('input');
    questionBox.placeholder = 'Enter Question';
    questionBox.className = 'question_input';
    quiz_form.appendChild(questionBox);


});

// CHECK ALL THAT APPLY - Function to create check all question ---------------
fillInBtn.addEventListener('click', (e) => {
    let questionBox = document.createElement('input');
    questionBox.placeholder = 'Enter Question';
    questionBox.className = 'question_input';
    quiz_form.appendChild(questionBox);


});

// FILL IN THE BLANK - Function to create fill in blank question --------------
checkAllBtn.addEventListener('click', (e) => {
    let questionBox = document.createElement('input');
    questionBox.placeholder = 'Enter Question';
    questionBox.className = 'question_input';
    quiz_form.appendChild(questionBox);


});

// SHOW SUBMIT BUTTON - Function to render submit button after 1+ questions created


// QUIZ FORM SUBMISSION - Function to submit the quiz on completion
quiz_form.addEventListener('submit', (err) => {
    err.preventDefault();

    // Remove navigation prompt on form submission
    window.onbeforeunload = null;


});
