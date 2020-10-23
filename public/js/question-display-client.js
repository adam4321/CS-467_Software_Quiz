/******************************************************************************
**  Description: QUIZ BUILDER PAGE - client side javascript file that creates
**               a quiz and displays entries while building
******************************************************************************/
// Target quiz display
let quiz_display = document.getElementById('quiz_display');

// Append True/False Question
function appendQuestionTF(question_num, question_text, tfValue){
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
}
