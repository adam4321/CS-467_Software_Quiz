/******************************************************************************
**  Description: DASHBOARD PAGE - client side javascript file that prevents
**               page refresh when sending quiz
**
**  Contains:    1 function that prevents default
******************************************************************************/

/* =================== QUIZ POST VALIDATION FUNCTIONS ======================== */
let el_send_email = document.getElementById("submit_email");

/* SUBMIT form - Function to verify responses before posting -------------- */
el_send_email.addEventListener('click', (e) => {
    //e.preventDefault();
    let status_tag = document.getElementById('send_status');
    status_tag.innerText = "Email on its way"
});
