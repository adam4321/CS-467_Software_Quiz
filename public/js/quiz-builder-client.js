/******************************************************************************
**  Description: QUIZ BUILDER PAGE - client side javascript file that creates
**               a quiz dynamically and submits the form to the server
******************************************************************************/

// Enable navigation prompt for leaving page early
window.onbeforeunload = function() {
    return true;
};

// Target button ids
let true_false_btn = document.getElementById('true_false_btn');
let multiple_c_btn = document.getElementById('multiple_c_btn');
let fill_in_btn = document.getElementById('fill_in_btn');

// Target quiz form
let quiz_form = document.getElementById('quiz_form');

// TRUE/FALSE BUTTON - Function to create true false question 
true_false_btn.addEventListener("click", (err) => {
    let unique_question = document.createElement("input");
    unique_question.placeholder="Enter Question"
    unique_question.className="question_input";
    quiz_form.appendChild(unique_question);
})


// QUIZ FORM SUBMISSION - Function to submit the quiz on completion
quiz_form.addEventListener("submit", (err) => {
    err.preventDefault();

    // Remove navigation prompt on form submission
    window.onbeforeunload = null;


})
