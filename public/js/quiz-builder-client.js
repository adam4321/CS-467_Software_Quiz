/******************************************************************************
**  Description: QUIZ BUILDER PAGE - client side javascript file that creates
**               a quiz dynamically and submits the form to the node server
**               POST route /quiz_create/submit_quiz
**
**  Contains:    4 functions which each handle the creation of a quiz question.
**               4 functions which each handle the display of a created
**               question and its associated delete button which are called by
**               the factory function displayQuizHandler. 
******************************************************************************/

// Declare an empty quiz object
let quiz = {};

// Parse the url for the quiz setup
const urlParams = new URLSearchParams(window.location.search);

// Enter the quiz setup values into the quiz object
quiz.title      = urlParams.get('quiz_title');
quiz.category   = urlParams.get('category');
quiz.limit      = urlParams.get('time_limit');
quiz.questions  = [];

// Global iterator for question count (Must be 1+ to submit quiz)
let QUESTION_COUNT        = 0;
let questionCount         = document.getElementById('question-count');
questionCount.textContent = QUESTION_COUNT;

// Target button ids
let trueFalseBtn = document.getElementById('true_false_btn');
let multBtn      = document.getElementById('multiple_c_btn');
let fillInBtn    = document.getElementById('fill_in_btn');
let checkAllBtn  = document.getElementById('choose_all_btn');

// Target quiz form
let quiz_form = document.getElementById('quiz_form');

// Create submit button
let submitBtn         = document.createElement('button');
let line              = document.createElement('hr');
submitBtn.id          = 'submit-btn';
submitBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored';
submitBtn.textContent = 'Submit Quiz';

// Target Cancel Build button
let cancelBuildBtn = document.getElementById('exit_btn');

// Target quiz display div
let quiz_container = document.getElementById('quiz_display_container');
quiz_container.style.display = 'none';

// Target quiz display tbody and track order of questions added (to use in deletion)
let quiz_display  = document.getElementById('quiz_display');
let INITIAL_ORDER = 0;


/* ----------------------- BUTTON FUNCTIONS -------------------------------- */

/* Test multipl choice TODO: modify to add another answerBox --------------- */
function answerOnClick(event) { 
    alert("Answer onclick handler") 
};


/* Confirm back button page exit ------------------------------------------- */
window.onbeforeunload = function() {
    return true;
};


/* CANCEL BUILD BUTTON - Function to confirm quiz exit --------------------- */
cancelBuildBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (confirm('Are you sure that you want to exit?')) {
        // Remove navigation prompt on form submission
        window.onbeforeunload = null;
        window.location.href='/quiz_builder';
    } else {
        return false;
    }
});


/* Handles what function to add to the display from the quiz object -------- */
function displayQuizHandler(question_num, question_arr){
    // Retreive last added question
    let q_obj = question_arr[question_arr.length-1];
    let quiz_type = q_obj.quizType;
    let question_text = q_obj.quizQuestion;
    let question_key = q_obj.quizKey;
    
    switch (quiz_type) {
    // If True False Question
        case "true-false":
            renderQuestionTF(question_num, question_text, question_key);
            break;
        // If Multiple Choices Question
        case "mult-choice":
            //appendQuestionMultChoice();
            break;
        // If Fill in the Blank Question
        case "fill-blank":
            renderQuestionFillBlank(question_num, question_text, question_key);
            break;
        // If Check All Question
        case "check-all":
            //appendQuestionCheckAll();
            break;
    }
};


/* Append True/False Question ---------------------------------------------- */
function renderQuestionTF(question_num, question_text, tfValue) {
    // If adding question show container
    if (quiz_container.style.display === 'none') {
        quiz_container.style.display = 'block';
    }

    // Increment the question added index for possible deletion later
    INITIAL_ORDER++;

    // Add a new row to display the question
    let tableRowDisplay = document.createElement('tr');
    tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    quiz_display.appendChild(tableRowDisplay);

    let tableDisplay = document.createElement('td');
    tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    tableRowDisplay.appendChild(tableDisplay);

    // Use the correct question_num value to track the question count
    let headerDisplay = document.createElement('h5');
    headerDisplay.innerText  = "Q" + question_num;
    tableDisplay.appendChild(headerDisplay);

    let questionDisplay = document.createElement('i');
    questionDisplay.innerText  = question_text;
    tableDisplay.appendChild(questionDisplay);

    let ansTrueDisplay = document.createElement('li');
    ansTrueDisplay.id  = 'ansTrueDisplay' + INITIAL_ORDER;
    ansTrueDisplay.innerHTML  = "True " + (tfValue ? "&#x2611" : "");
    tableDisplay.appendChild(ansTrueDisplay);

    let ansFalseDisplay = document.createElement('li');
    ansFalseDisplay .id  = 'ansFalseDisplay' + INITIAL_ORDER;
    ansFalseDisplay .innerHTML  = "False " + (tfValue ? "" :  "&#x2611");
    tableDisplay.appendChild(ansFalseDisplay);

    let tableDeleteDisplay = document.createElement('td');
    tableDeleteDisplay.id  = "tableDeleteDisplay_" + INITIAL_ORDER;
    tableDeleteDisplay.innerHTML = "<button>Delete</button>"
    tableRowDisplay.appendChild(tableDeleteDisplay);

    // Delete button handler to remove the question for the quiz object and the DOM
    tableDeleteDisplay.addEventListener('click', (e) => {
        e.preventDefault();

        // Find array index of the question to remove
        let qIndex = headerDisplay.innerText.substring(1, headerDisplay.innerText.length);
        qIndex--;

        // Remove the question from the quiz object
        quiz.questions.splice(qIndex, 1);

        // Remove the displayed question
        tableRowDisplay.remove();

        // Update the question count
        questionCount.textContent = --QUESTION_COUNT;

        // Remove the submit button if there are no questions
        if (QUESTION_COUNT === 0) {
            quiz_container.style.display = 'none';
            line.style.display           = 'none';
            submitBtn.style.display      = 'none';
        }
        else {
            // Update the Q numbers of remaining questions
            for (var i = 0, row; row = quiz_display.rows[i]; i++) {
                row.children[0].childNodes[0].innerText = `Q${i + 1}`;
            }
        }

        // Display for testing and REMOVE FOR DEPLOYMENT
        console.log(quiz);
    })
};


/* Append Multiple Choice Question ----------------------------------------- */



/* Append Fill in the Blank Question --------------------------------------- */
function renderQuestionFillBlank(question_num, question_text, question_key) {
    // If adding question show container
    if (quiz_container.style.display === 'none') {
        quiz_container.style.display = 'block';
    }

    // Increment the question added index for possible deletion later
    INITIAL_ORDER++;

    // Add a new row to display the question
    let tableRowDisplay = document.createElement('tr');
    tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    quiz_display.appendChild(tableRowDisplay);

    let tableDisplay = document.createElement('td');
    tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    tableRowDisplay.appendChild(tableDisplay);

    // Use the correct question_num value to track the question count
    let headerDisplay = document.createElement('h5');
    headerDisplay.innerText  = "Q" + question_num;
    tableDisplay.appendChild(headerDisplay);

    let questionDisplay = document.createElement('i');
    questionDisplay.innerText  = `${question_text[0]} ${question_key} ${question_text[1]}`;
    tableDisplay.appendChild(questionDisplay);

    let tableDeleteDisplay = document.createElement('td');
    tableDeleteDisplay.id  = "tableDeleteDisplay_" + INITIAL_ORDER;
    tableDeleteDisplay.innerHTML = "<button>Delete</button>"
    tableRowDisplay.appendChild(tableDeleteDisplay);

    // Delete button handler to remove the question for the quiz object and the DOM
    tableDeleteDisplay.addEventListener('click', (e) => {
        e.preventDefault();

        // Find array index of the question to remove
        let qIndex = headerDisplay.innerText.substring(1, headerDisplay.innerText.length);
        qIndex--;

        // Remove the question from the quiz object
        quiz.questions.splice(qIndex, 1);

        // Remove the displayed question
        tableRowDisplay.remove();

        // Update the question count
        questionCount.textContent = --QUESTION_COUNT;

        // Remove the submit button if there are no questions
        if (QUESTION_COUNT === 0) {
            quiz_container.style.display = 'none';
            line.style.display           = 'none';
            submitBtn.style.display      = 'none';
        }
        else {
            // Update the Q numbers of remaining questions
            for (var i = 0, row; row = quiz_display.rows[i]; i++) {
                row.children[0].childNodes[0].innerText = `Q${i + 1}`;
            }
        }

        // Display for testing and REMOVE FOR DEPLOYMENT
        console.log(quiz);
    })
};


/* Append Check all Question ----------------------------------------------- */



/* TRUE/FALSE BUTTON - Function to create true false question -------------- */
trueFalseBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Create a div to append to
    let createBox = document.createElement('div');
    createBox.id  = 'createBox';
    quiz_form.appendChild(createBox);

    // Hide the question selection buttons, submit, and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';
    submitBtn.style.display      = 'none';
    line.style.display           = 'none';

    // Increment and display question number
    let questionNum = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${QUESTION_COUNT + 1}`;
    createBox.appendChild(questionNum);

    // Create the question input
    let questionBox = document.createElement('input');
    questionBox.placeholder = 'Enter Question';
    questionBox.id          = 'questionBox';
    questionBox.className   = 'question_input';
    createBox.appendChild(questionBox);

    // Create true radio button
    let trueRadio = document.createElement('input');
    trueRadio.type    = 'radio';
    trueRadio.id      = 'true-radio';
    trueRadio.value   = 'True';
    trueRadio.name    = 'true-false';
    trueRadio.checked = false;

    // Create false radio button
    let falseRadio = document.createElement('input');
    falseRadio.type    = 'radio';
    falseRadio.id      = 'false-radio';
    falseRadio.value   = 'False';
    falseRadio.name    = 'true-false';
    falseRadio.checked = false;
    
    // Label the buttons
    let labelTrue      = document.createElement('label');
    let labelFalse     = document.createElement('label');
    labelTrue.htmlFor  = 'true-radio';
    labelFalse.htmlFor = 'false-radio';
    
    // Create text descriptions
    let descriptionTrue  = document.createTextNode('True');
    let descriptionFalse = document.createTextNode('False');
    labelTrue.appendChild(descriptionTrue);
    labelFalse.appendChild(descriptionFalse);
    
    // Add the buttons to the DOM
    let newline = document.createElement('br');
    createBox.appendChild(trueRadio);
    createBox.appendChild(labelTrue);
    createBox.appendChild(newline);
    createBox.appendChild(falseRadio);
    createBox.appendChild(labelFalse);
    createBox.appendChild(newline);

    // Show the question complete button
    let completeBtn = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    createBox.appendChild(completeBtn);

    // Show the question cancel button
    let cancelBtn = document.createElement('button');
    cancelBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    cancelBtn.textContent = 'Cancel Question';
    createBox.appendChild(cancelBtn);

    // Event handler to register the new question
    completeBtn.addEventListener('click', (e) => {
        // Input validation to require values for question and answer
        questionBox.required = true;
        trueRadio.required   = 'true';

        // Check if the required fields are filled
        if (questionBox.value !== '' && 
            document.getElementById("true-radio").checked || document.getElementById("false-radio").checked) {
            // Check whether true or false
            let tfValue;
            if (document.getElementById("true-radio").checked) {
                tfValue = true;
            } else {
                tfValue = false;
            }

            // Create question object (No answers because they are always 'True' and 'False')
            let obj = {
                quizQuestion: questionBox.value,
                quizKey: tfValue,
                quizType: 'true-false'
            }
        
            // Insert the question object into the quiz object
            quiz.questions.push(obj);
            console.log(quiz);

            // Remove the question setup from DOM and display the question type buttons
            createBox.remove();
            questionPrompt.style.display = 'block';
            for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

            // Increment question count
            questionCount.textContent = ++QUESTION_COUNT;

            // Display saved question
            displayQuizHandler(QUESTION_COUNT, quiz.questions);

            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });

    // Event handler for the cancel button
    cancelBtn.addEventListener('click', (e) => {
        // Hide the complete button
        createBox.remove();
        questionPrompt.style.display = 'block';
        for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

        if (QUESTION_COUNT >= 1) {
            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });
});


/* MULTIPLE CHOICE BUTTON - Function to create mult choice question -------- */
multBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Create a div to append to
    let createBox = document.createElement('div');
    createBox.id  = 'createBox';
    quiz_form.appendChild(createBox);

    // Hide the question selection buttons, submit, and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';
    submitBtn.style.display      = 'none';
    line.style.display           = 'none';

    // Increment and display question number
    let questionNum = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${QUESTION_COUNT + 1}`;
    createBox.appendChild(questionNum);

    // Create the question input
    let questionBox = document.createElement('input');
    questionBox.placeholder = 'Enter Question';
    questionBox.id          = 'questionBox';
    questionBox.className   = 'question_input';
    createBox.appendChild(questionBox);

    // Create the answer in the blank input
    let answerBox = document.createElement('input');
    let lineBreak = document.createElement('hr');
    answerBox.placeholder = 'Answer in blank';
    answerBox.id          = 'answerBox';
    answerBox.className   = 'answer_input';
    answerBox.onclick     = answerOnClick;
    answerBox.setAttribute('data-lpignore','true');
    createBox.appendChild(lineBreak);
    createBox.appendChild(answerBox);


    
    // TODO - dynamic number of answers with radio buttons to select the correct answer and x's to delete


    // Show the question complete button
    let completeBtn = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    createBox.appendChild(completeBtn);

    // Show the question cancel button
    let cancelBtn = document.createElement('button');
    cancelBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    cancelBtn.textContent = 'Cancel Question';
    createBox.appendChild(cancelBtn);

    // Event handler to register the new question
    completeBtn.addEventListener('click', (e) => {
        // Input validation to require values for question and answer
        questionBox.required = true;
        answerBox.required = true;
        trueRadio.required   = 'true';

        // Check if the required fields are filled
        if (questionBox.value !== '' && 
            document.getElementById("true-radio").checked || document.getElementById("false-radio").checked) {
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
                quizKey: tfValue,
                quizType: 'mult-choice'
            }
        
            // Insert the question object into the quiz object
            quiz.questions.push(obj);
            console.log(quiz);

            // Remove the question setup from DOM and display the question type buttons
            createBox.remove();
            questionPrompt.style.display = 'block';
            for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

            // Increment question count
            questionCount.textContent = ++QUESTION_COUNT;

            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });

    // Event handler for the cancel button
    cancelBtn.addEventListener('click', (e) => {
        // Hide the complete button
        createBox.remove();
        questionPrompt.style.display = 'block';
        for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

        if (QUESTION_COUNT >= 1) {
            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });
});


/* FILL IN THE BLANK - Function to create fill in blank question ----------- */
fillInBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Create a div to append to
    let createBox = document.createElement('div');
    createBox.id  = 'createBox';
    quiz_form.appendChild(createBox);

    // Hide the question selection buttons, submit, and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';
    submitBtn.style.display      = 'none';
    line.style.display           = 'none';

    // Increment and display question number
    let questionNum = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${QUESTION_COUNT + 1}`;
    createBox.appendChild(questionNum);

    // Create the first question fragment input
    let questionBox1 = document.createElement('input');
    questionBox1.placeholder = 'Question before blank';
    questionBox1.id          = 'questionBox1';
    questionBox1.className   = 'question_input';
    createBox.appendChild(questionBox1);

    // Create the second question fragment input
    let questionBox2 = document.createElement('input');
    questionBox2.placeholder = 'Question after blank';
    questionBox2.id          = 'questionBox2';
    questionBox2.className   = 'question_input';
    createBox.appendChild(questionBox2);

    // Create the answer in the blank input
    let answerBox = document.createElement('input');
    let lineBreak = document.createElement('hr');
    answerBox.placeholder = 'Answer in blank';
    answerBox.id          = 'answerBox';
    answerBox.className   = 'answer_input';
    answerBox.setAttribute('data-lpignore','true');
    createBox.appendChild(lineBreak);
    createBox.appendChild(answerBox);

    // Show the question complete button
    let completeBtn = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    createBox.appendChild(completeBtn);

    // Show the question cancel button
    let cancelBtn = document.createElement('button');
    cancelBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    cancelBtn.textContent = 'Cancel Question';
    createBox.appendChild(cancelBtn);

    // Event handler to register the new question
    completeBtn.addEventListener('click', (e) => {
        // Input validation to require values for question and answer
        questionBox1.required = true;
        questionBox2.required = true;
        answerBox.required = true;

        // Check if the required fields are filled
        if (questionBox1.value !== '' && questionBox2.value !== '' && answerBox.value !== '') {
            // Create question object (No answers because it is always an empty string)
            let obj = {
                quizQuestion: [questionBox1.value, questionBox2.value],
                quizKey: answerBox.value,
                quizType: 'fill-blank'
            }
        
            // Insert the question object into the quiz object
            quiz.questions.push(obj);
            console.log(quiz);

            // Remove the question setup from DOM and display the question type buttons
            createBox.remove();
            questionPrompt.style.display = 'block';
            for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

            // Increment question count
            questionCount.textContent = ++QUESTION_COUNT;

            // Display saved question
            displayQuizHandler(QUESTION_COUNT, quiz.questions);

            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });

    // Event handler for the cancel button
    cancelBtn.addEventListener('click', (e) => {
        // Hide the complete button
        createBox.remove();
        questionPrompt.style.display = 'block';
        for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

        if (QUESTION_COUNT >= 1) {
            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });
});


/* CHECK ALL THAT APPLY - Function to create check all question ------------ */
checkAllBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Create a div to append to
    let createBox = document.createElement('div');
    createBox.id  = 'createBox';
    quiz_form.appendChild(createBox);

    // Hide the question selection buttons, submit, and prompt
    for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'none';
    let questionPrompt = document.getElementById('question-prompt');
    questionPrompt.style.display = 'none';
    submitBtn.style.display      = 'none';
    line.style.display           = 'none';

    // Increment and display question number
    let questionNum = document.createElement('p');
    questionNum.className   = 'questionNum';
    questionNum.textContent = `Question #${QUESTION_COUNT + 1}`;
    createBox.appendChild(questionNum);

    // Create the question input
    let questionBox = document.createElement('input');
    questionBox.placeholder = 'Enter Question';
    questionBox.id          = 'questionBox';
    questionBox.className   = 'question_input';
    createBox.appendChild(questionBox);



    // TODO - dynamic number of check all answers with check boxes to set the correct answers


    // Show the question complete button
    let completeBtn = document.createElement('button');
    completeBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    completeBtn.textContent = 'Complete Question';
    createBox.appendChild(completeBtn);

    // Show the question cancel button
    let cancelBtn = document.createElement('button');
    cancelBtn.className   = 'mdl-button mdl-js-button mdl-button--raised  mdl-button--colored complete-button';
    cancelBtn.textContent = 'Cancel Question';
    createBox.appendChild(cancelBtn);

    // Event handler to register the new question
    completeBtn.addEventListener('click', (e) => {
        // Input validation to require values for question and answer
        questionBox.required = true;
        trueRadio.required   = 'true';

        // Check if the required fields are filled
        if (questionBox.value !== '' && 
            document.getElementById("true-radio").checked || document.getElementById("false-radio").checked) {
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
                quizAnswers: tfValue,
                quizType: 'check-all'
            }
        
            // Insert the question object into the quiz object
            quiz.questions.push(obj);
            console.log(quiz);

            // Remove the question setup from DOM and display the question type buttons
            createBox.remove();
            questionPrompt.style.display = 'block';
            for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

            // Increment question count
            questionCount.textContent = ++QUESTION_COUNT;

            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });

    // Event handler for the cancel button
    cancelBtn.addEventListener('click', (e) => {
        // Hide the complete button
        createBox.remove();
        questionPrompt.style.display = 'block';
        for (let el of document.querySelectorAll('.question-btn')) el.style.display = 'inline-block';

        if (QUESTION_COUNT >= 1) {
            // Display submit button
            line.style.display      = 'block';
            submitBtn.style.display = 'block';
            quiz_form.appendChild(line);
            quiz_form.appendChild(submitBtn);
        }
    });
});


// QUIZ FORM SUBMISSION - Function to submit the quiz on completion
quiz_form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Remove navigation prompt on form submission
    window.onbeforeunload = null;

    let req = new XMLHttpRequest();
    let path = '/quiz_create/save_quiz';

    // String that holds the form data
    let reqBody = {
        name: quiz.title,
        category: quiz.category,
        timeLimit: quiz.limit,
        questions: quiz.questions
    };

    reqBody = JSON.stringify(reqBody);

    // Ajax HTTP POST request
    req.open('POST', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            console.log('Quiz sent to server');
            window.location.href = '/quiz_builder';
        } else {
            console.error('Database return error');
        }
    });

    req.send(reqBody);
});
