/******************************************************************************
**  Description: DASHBOARD PAGE - client side javascript file that prevents
**               page refresh when sending quiz
**
**  Contains:    1 function that prevents default
******************************************************************************/

/* =================== QUIZ POST VALIDATION FUNCTIONS ======================== */
// Get form
let el_send_email = document.getElementById("test_sendgrid");
// Get button
let el_send_email_btn = document.getElementById("submit_email");
// Get animation
let el_send_email_animation = document.getElementById("modal");

/* SUBMIT form - Function to display status -------------- */
el_send_email_btn.addEventListener('click', (e) => {
    e.preventDefault();
    for(var i=0; i < el_send_email.elements.length; i++){
        if(el_send_email.elements[i].value === '' && el_send_email.elements[i].hasAttribute('mandatory')){
            alert('There are some required fields!');
            return false;
        }
    }
    console.log("Email on its way");
    el_send_email.submit();

    el_send_email_animation.style.display = 'block';
    setTimeout(() => {
        el_send_email_animation.style.display = 'none';
    }, 3000);
});
