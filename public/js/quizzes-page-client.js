/******************************************************************************
**  Description:  MY QUIZZES PAGE - client side javascript file that 
**
**  Contains:     deleteQuiz
**                downloadQuiz
**                uploadQuiz
******************************************************************************/

/* DELETE QUIZ - Function to delete a quiz and update the table ------------ */
function deleteQuiz(tbl, curRow, quizId) {
    if (!confirm("Are you sure?")) {
        return;
    }
    else {
        let table = document.getElementById(tbl);
        let rowCount = table.rows.length;
        let req = new XMLHttpRequest();
        let path = "/quizzes/delete";
        let reqBody = JSON.stringify({id: quizId});

        req.open("POST", path, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                // Check if the table will have more than the header row after the deletion
                if (rowCount > 2) {
                    // Iterate over the table and find the row to delete
                    for (let i = 0; i < rowCount; i++) {
                        let row = table.rows[i];

                        // Delete the row of the deleted quiz
                        if (row == curRow.parentNode.parentNode) {
                            table.deleteRow(i);
                        }
                    }
                }
                else {
                    // Remove the card and replace it with the no quizzes card
                    let card    = document.getElementById('dashboard-container');
                    let photo   = document.getElementById('profile-image');
                    let email   = document.getElementById('profile-email');
                    card.remove();

                    // Add container to the page
                    let quizzesEmpty       = document.createElement('div');
                    quizzesEmpty.classList = 'mdl-card mdl-shadow--2dp';
                    quizzesEmpty.id        = 'dashboard-container-empty';
                    document.getElementById('top-row-container').appendChild(quizzesEmpty);

                    // Create the card header
                    let topBar            = document.createElement('div');
                    let cardTitle         = document.createElement('h2');
                    topBar.classList      = 'mdl-card__title mdl-color-text--white dashboard-top-bar';
                    cardTitle.classList   = 'mdl-card__title-text';
                    cardTitle.textContent = 'My Quizzes';
                    quizzesEmpty.appendChild(topBar);
                    topBar.appendChild(cardTitle);

                    // Create the empty quiz container
                    let emptyContainer       = document.createElement('div');
                    emptyContainer.classList = 'mdl-card__supporting-text mdl-color-text--grey-600 no-quiz-content';
                    quizzesEmpty.appendChild(emptyContainer);

                    // Fill the empty quiz container with the user's information
                    let newPhoto = document.createElement('img');
                    let newEmail = document.createElement('p');
                    newPhoto     = photo;
                    newEmail     = email;
                    newPhoto.id  = 'profile-image';
                    newEmail.id  = 'profile-email-new';
                    emptyContainer.appendChild(newPhoto);
                    emptyContainer.appendChild(newEmail);

                    // Create the upload button
                    let uploadDiv = document.createElement('div');
                    let uploadMsg = document.createElement('p');
                    let btnLabel  = document.createElement('label');
                    let uploadBtn = document.createElement('input');

                    uploadDiv.id          = 'upload-div';
                    uploadMsg.id          = 'upload-txt';
                    uploadMsg.textContent = 'Upload a Quiz';
                    btnLabel.id           = 'upload-btn-empty';
                    btnLabel.className    = 'btn-style';
                    btnLabel.textContent  = 'Upload';
                    uploadBtn.id          = 'upload-hidden';
                    uploadBtn.className   = 'btn-style';
                    uploadBtn.accept      = '.quiz';
                    uploadBtn.type        = 'file';

                    emptyContainer.appendChild(uploadDiv);
                    uploadDiv.appendChild(uploadMsg);
                    uploadDiv.appendChild(btnLabel);
                    uploadDiv.appendChild(uploadBtn);

                    // Fill the empty quiz container with the no quizzes message
                    let newBreak = document.createElement('hr');
                    let msgDiv   = document.createElement('div');
                    let newLogo  = document.createElement('img');
                    let newMsg   = document.createElement('p');

                    newBreak.id        = 'no-quiz-break';
                    msgDiv.id          = 'no-quiz-div';
                    newLogo.id         = 'question-logo';
                    newLogo.src        = 'images/logo.png';
                    newMsg.id          = 'no-quiz-txt';
                    newMsg.textContent = 'No Quizzes Created';

                    emptyContainer.appendChild(newBreak);
                    emptyContainer.appendChild(msgDiv);
                    msgDiv.appendChild(newLogo);
                    msgDiv.appendChild(newMsg);
                }
            } 
            else {
                console.error("Delete request error");
            }
        });

        req.send(reqBody);
    }
} 


/* DOWNLOAD QUIZ - Function to download a quiz ----------------------------- */
function downloadQuiz(tbl, curRow, quizId) {    
    let req = new XMLHttpRequest();
    let path = "/quizzes/download";
    let reqBody = JSON.stringify({id: quizId});

    req.open("POST", path, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            // Create the download link from the quiz object
            let downQuiz = JSON.parse(req.responseText)
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downQuiz));
            let downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);

            // Name the quiz download and its file extension
            downloadAnchorNode.setAttribute("download", downQuiz.quiz.name + ".quiz");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } 
        else {
            console.error("Download request error");
        }
    });

    req.send(reqBody);
}


/* UPLOAD QUIZ - Function to upload a quiz to the server ------------------- */
document.getElementById('upload-hidden').onchange = (e) => {
    try {
        // Only accept one file
        let files = e.target.files;
        let file = files[0];
        let quizUpload = {};
        let reader = new FileReader();

        // Handle a failed client side file upload
        reader.onerror = () => {
            console.error(reader.error);
        };

        // Handle a successful client side file upload
        reader.onload = (event) => {
            quizUpload = event.target.result;

            console.log(quizUpload)

            // Create a request to the server route using the uploaded quiz
            let req = new XMLHttpRequest();
            let path = "/quizzes/upload";
            let reqBody = JSON.stringify({quiz: quizUpload});
    
            // Send the file to the server side
            req.open("POST", path, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener("load", () => {
                if (req.status >= 200 && req.status < 400) {
                    console.log('Quiz added');

                    // Check if the table is empty or has rows
                    let table = document.getElementById('recordTable');

                    // If there are no quizzes
                    if (!table) {
                        

                    }
                    else {
                        // Add a new row to the table
                        let newRow = table.insertRow(-1);




                        // Delete button element
                        let deleteCell = document.createElement('td');
                        newRow.appendChild(deleteCell);
                        let deleteBtn = document.createElement('input');
                        deleteCell.appendChild(deleteBtn);
                        deleteBtn.type = "button";
                        deleteBtn.value = "Delete";
                        deleteBtn.className = "btn-style";
                        deleteBtn.setAttribute('onclick', 'deleteQuiz(`recordTable`, this, `{{_id}}`);');

                        // Download button element
                        let downloadCell = document.createElement('td');
                        newRow.appendChild(downloadCell);
                        let downloadBtn = document.createElement('input');
                        downloadCell.appendChild(downloadBtn);
                        downloadBtn.type = "button";
                        downloadBtn.value = "Download";
                        downloadBtn.className = "btn-style";
                        downloadBtn.setAttribute('onclick', 'downloadQuiz(`recordTable`, this, `{{_id}}`);');
                    }
                } 
                else {
                    console.error("Upload request error");
                    alert('Error in uploading the quiz');
                }
            });

            req.send(reqBody);
        };

        reader.readAsText(file);
    } 
    catch (err) {
        console.error(err);
        alert('Error in uploading the quiz');
    }
}
