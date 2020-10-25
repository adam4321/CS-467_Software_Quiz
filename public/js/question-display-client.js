/******************************************************************************
**  Description: QUIZ BUILDER PAGE - client side javascript file that creates
**               a quiz and displays entries while building
******************************************************************************/

// Target quiz display div
let quiz_container= document.getElementById('quiz_display_container');
quiz_container.style.display = 'none';

// Target quiz display tbody
let quiz_display = document.getElementById('quiz_display');


// Handles what function to add to the display from the quiz object
function displayQuizHandler(question_num, question_arr){
    // Retreive last added question
    let q_obj = question_arr[question_arr.length-1];
    let quiz_type = q_obj.quizType;
    let question_text = q_obj.quizQuestion;
    let question_key = q_obj.quizKey;
    
    switch (quiz_type) {
    // If True False Question
    case "true-false":
        appendQuestionTF(question_num, question_text, question_key);
        break;
    // If Multiple Choices Question
    case "mult-choice":
        //appendQuestionMultChoice();
        break;
    // If Fill in the Blank Question
    case "fill-blank":
        //appendQuestionFillBlank();
        break;
    // If Check All Question
    case "check-all":
        //appendQuestionCheckAll();
        break;
    }
}


// Append True/False Question
function appendQuestionTF(question_num, question_text, tfValue) {
    // If adding question show container
    if (quiz_container.style.display === 'none'){
            quiz_container.style.display = 'block';
    }
    let tableRowDisplay = document.createElement('tr');
    tableRowDisplay.id  = "tableRow_" + question_num;
    quiz_display.appendChild(tableRowDisplay);

    let tableDisplay = document.createElement('td');
    tableDisplay.id  = "tableDisplay_" + question_num;
    tableRowDisplay.appendChild(tableDisplay);

    let headerDisplay = document.createElement('h5');
    headerDisplay.innerText  = "Q" + question_num;
    tableDisplay.appendChild(headerDisplay);

    let questionDisplay = document.createElement('i');
    questionDisplay.innerText  = question_text;
    tableDisplay.appendChild(questionDisplay);

    let ansTrueDisplay = document.createElement('li');
    ansTrueDisplay.id  = 'ansTrueDisplay' + question_num;
    ansTrueDisplay.innerHTML  = "True " + (tfValue ? "&#x2611" : "");
    tableDisplay.appendChild(ansTrueDisplay);

    let ansFalseDisplay = document.createElement('li');
    ansFalseDisplay .id  = 'ansFalseDisplay' + question_num;
    ansFalseDisplay .innerHTML  = "False " + (tfValue ? "" :  "&#x2611");
    tableDisplay.appendChild(ansFalseDisplay);

    let tableDeleteDisplay = document.createElement('td');
    tableDeleteDisplay.id  = "tableDeleteDisplay_" + question_num;
    tableDeleteDisplay.innerHTML = "<button>Delete</button>"
    tableRowDisplay.appendChild(tableDeleteDisplay);

    tableDeleteDisplay.addEventListener('click', (e) => {
        e.preventDefault();



        
    })
}
