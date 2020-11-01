/******************************************************************************
**  Description: TAKE QUIZ PAGE - client side javascript file that creates
**               a verifies quiz responses, handles POST and times the quiz
**
**  Contains:    1 function that veririfes check-box is checked if not leave
**               default value.
******************************************************************************/

/* =================== QUIZ POST VALIDATION FUNCTIONS ======================== */

document.getElementById("take_quiz").onsubmit = function() {verifyResponses()};

/* SUBMIT form - Function to verify responses before posting -------------- */
var verifyResponses = function(){
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

  alert("The form was submitted");//TODO: remove
}