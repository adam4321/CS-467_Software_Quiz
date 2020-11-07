/******************************************************************************
**  Description: DASHBOARD PAGE - client side javascript file that submits
**               remove user button
**
**  Contains:    1 function removes user
******************************************************************************/

/* =================== QUIZ POST VALIDATION FUNCTIONS ======================== */
let el_remove_user = document.getElementById("removeUserButton");

/* SUBMIT form - Function to display status -------------- */
el_remove_user.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove navigation prompt on form submission
    window.onbeforeunload = null;

    let req = new XMLHttpRequest();
    let path = '/dashboard';

    // Ajax HTTP POST request
    req.open('POST', path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            console.log('Removed User');
            window.location.href = '/logout';
        } else {
            console.error('Database return error');
        }
    });

    req.send();

});
