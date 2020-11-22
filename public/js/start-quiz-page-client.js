/******************************************************************************
**  Description: START QUIZ PAGE - client side javascript file that takes the 
**               candidate to the take_quiz/:token/quiz route
**
**  Contains:    1 function that starts the quiz by getting the next route
******************************************************************************/


/* =================== QUIZ DISPLAY FUNCTIONS ======================== */

document.getElementById("start-btn").addEventListener('click', (e) => {
    e.preventDefault();
    let path = window.location.pathname;
    // Route the candidate to the quiz page
    window.location.href = `${path}/quiz`;
  
});