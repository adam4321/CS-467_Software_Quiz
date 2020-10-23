/******************************************************************************
**  Description: QUIZ BUILDER PAGE - client side javascript file that creates
**               modifies the quiz object when an object is removed from it
******************************************************************************/
// Target quiz display tbody
let quiz_display = document.getElementById('quiz_display');

// Handles what function to add to the display from the quiz object
function modifyQuizHandler(question_num, question_arr){
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
