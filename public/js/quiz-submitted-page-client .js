/******************************************************************************
**  Description: QUIZ SUBMITTED PAGE - client side javascript file that creates
**               removes the local storage only when the quiz zumbitted page is
**               closed.
**
******************************************************************************/
/* Remove item on browser or tab close ------------------------------------------- */
window.onunload = function() {
    // Clear the local storage
    localStorage.removeItem('start_quiz_semaphore');
    localStorage.removeItem('time_stamp');
    localStorage.removeItem('start_quiz_semaphore');
    localStorage.removeItem('refresh_quiz_semaphore');
 }
