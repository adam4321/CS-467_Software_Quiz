/******************************************************************************
**  Description:  Client-side JavaScript file containing the button functions
**                for the login buttons in login-page.hbs
******************************************************************************/

function google_auth() {
   window.location.href = "/auth/google";
};

function facebook_auth() {
    window.location.href = "/auth/facebook";
}
