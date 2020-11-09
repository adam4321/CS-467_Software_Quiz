/******************************************************************************
**  Description: TAKE QUIZ PAGE - client side javascript file that creates
**               a verifies quiz responses, handles POST and times the quiz
**
**  Contains:    1 function that veririfes check-box is checked if not leave
**               default value. Also timing functionality for client.
******************************************************************************/


/* =================== QUIZ DISPLAY FUNCTIONS ======================== */
let el_start_quiz = document.getElementById("start_quiz");

el_start_quiz.addEventListener('click', (e) => {
    e.preventDefault();

    // Display the quiz and hide the start button
    let el_quiz = document.getElementById('quiz_elements');
    let el_start_quiz_div = document.getElementById('start_quiz_div');
    el_quiz.style.display = "block";
    el_start_quiz_div.style.display = "none";

    // Auto-submit the quiz when time runs out
    let timerText = document.getElementById('timer-text').textContent.split(':');
    let TIME_LIMIT = timerText[0] * 60000;

    setTimeout(() => {
        document.getElementById('timer-text').textContent = `00:00`;
        document.getElementById('submit-btn').click();
    }, TIME_LIMIT);

    // Count down on the timer display
    let minutes = parseInt(timerText[0]);
    let seconds = parseInt(timerText[1]);
    
    setInterval(() => {
        // Update the time and render the new time to the screen
        if (seconds == 0) {
            seconds = 59
            minutes--;

            if (minutes < 10) {
                document.getElementById('timer-text').textContent = `0${minutes}:${seconds}`;
            }
            else {
                document.getElementById('timer-text').textContent = `${minutes}:${seconds}`;
            }
        }
        else if (seconds <= 10) {
            seconds--;

            if (minutes < 10) {
                document.getElementById('timer-text').textContent = `0${minutes}:0${seconds}`;
            }
            else {
                document.getElementById('timer-text').textContent = `${minutes}:0${seconds}`;
            }
        }
        else {
            seconds--;

            if (minutes < 10) {
                document.getElementById('timer-text').textContent = `0${minutes}:${seconds}`;
            }
            else {
                document.getElementById('timer-text').textContent = `${minutes}:${seconds}`;
            }
        }        
    }, 1000);
});


/* =================== QUIZ POST VALIDATION FUNCTIONS ======================== */
document.getElementById("take_quiz").onsubmit = function() {verifyResponses()};

/* SUBMIT form - Function to verify responses before posting -------------- */
var verifyResponses = function() {
  let el_checks = document.querySelectorAll('input[class="check-all"]:not([id="default-check"])');
  let prev_name = "";
  let curr_name = "";
  let validate_any_chosen = 0;

  // Query all check-all classes with same name and if none selected. leave hidden default checkbox checked,
  // Else uncheck hidden default checkbox
  for (let i = 0; i < el_checks.length; i++){
    curr_name = el_checks[i].attributes.name.value;
    if (i === 0){
        prev_name = curr_name;
    }

    // For each question,
    // If any checks, then set hidden default checkbox to unchecked
    if ((curr_name != prev_name) || (i === (el_checks.length - 1))){
        if (validate_any_chosen > 0){
            // Set the default checkbox to unchecked
            let el_default_check = document.querySelectorAll('input[id="default-check"][name="'+prev_name+'"]');
            let default_box = el_default_check.item(0);
            default_box.checked = false;
        }
        // Reset validate variable
        validate_any_chosen = 0;
        prev_name = curr_name;
    }

    // If an answer is checked increment
    if (el_checks.item(i).checked === true){
        validate_any_chosen += 1;
    }
  }

  let el_time_display = document.getElementById('timer-text');
  let el_time_field = document.getElementById('timing_data');
  // Attach new value to hidden input based on timing
  el_time_field.setAttribute("value", el_time_display.innerText);
  
  alert("The quiz was submitted");
};
