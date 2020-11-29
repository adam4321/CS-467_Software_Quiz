/******************************************************************************
**  Description: QUIZ SUBMITTED PAGE - client side javascript file that creates
**               removes the local storage only when the quiz zumbitted page is
**               closed.
**
******************************************************************************/
/* Set Semaphore to show that quiz is submitted a back button will not generate the page ----*/
window.onload = function(e) {
    e.preventDefault();
    // Set the sumbit quiz semaphore to disable page upon retry with the back button
    localStorage.setItem('submit_quiz_semaphore', 1);
}

/* Remove item on browser or tab close ------------------------------------------- */
window.onunload = function() {
    // Clear the local storage
    localStorage.removeItem('start_quiz_semaphore');
    localStorage.removeItem('time_stamp');
    localStorage.removeItem('start_quiz_semaphore');
    localStorage.removeItem('refresh_quiz_semaphore');
 }
