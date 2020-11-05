/******************************************************************************
**  Description:  MY QUIZZES PAGE - client side javascript file that 
**
**  Contains:     deleteQuiz
**                downloadQuiz
**                uploadQuiz
******************************************************************************/

// /* DISPLAY QUIZ MODAL - Function to display each quiz ---------------------- */

function createModals() {
    let table = document.getElementById('table-body');

    // Test whether the user has quizzes
    if (table) {
        let quizCount = table.rows.length;

        // Declare 3 arrays to hold the elements
        let modals = [];
        let btns = [];
        let spans = [];

        // Iterate over the quizzes and create their modals
        for (let i = 0; i < quizCount; i++) {
            // Get the modals
            modals.push(document.getElementById(`modal${i}`));

            // Get the button that opens the modal
            btns.push(document.getElementById(`rowModal${i}`));

            // Get the <span> element that closes the modal
            spans.push(document.getElementsByClassName("close")[i]);

            // When the user clicks on the button, open the modal
            btns[i].onclick = function() {
                modals[i].style.display = "block";
            }

            // When the user clicks on <span> (x), close the modal
            spans[i].onclick = function() {
                modals[i].style.display = "none";
            }
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            for (let i = 0; i < quizCount; i++) {
                if (event.target == modals[i]) {
                    modals[i].style.display = "none";
                }
            } 
        }
    }
}

// Call the function
createModals();


/* DELETE QUIZ - Function to delete a quiz and update the table ------------ */
function deleteQuiz(tbl, curRow, quizId, event) {
    event.stopPropagation();

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
                        let deleteModal = document.getElementById(`modal${i - 1}`);

                        // Find the correct row for the quiz
                        if (row == curRow.parentNode.parentNode) {
                            // Delete the row's modal
                            deleteModal.remove();

                            // Delete the row of the deleted quiz
                            table.deleteRow(i);
                        }
                    }

                    // Update the remaining row's ids
                    let updateTable = document.getElementById('table-body');

                    for (let i = 0, updateRow; updateRow = updateTable.rows[i]; i++) {
                        // Update all of the rowModal ids
                        updateRow.id = `rowModal${i}`;
                    }

                    // Update the remaining row's modals
                    let updateModals = document.getElementsByClassName('modal');

                    for (let i = 0; i < updateTable.rows.length; i++) {
                        // Update all of the modal ids
                        updateModals.item(i).id  = `modal${i}`;
                    }
                    
                }
                else {
                    // Remove the card and replace it with the no quizzes card
                    let card    = document.getElementById('dashboard-container');
                    let photo_1 = document.getElementById('profile-image');
                    let photo_2 = document.getElementById('profile-image-new');
                    let email   = document.getElementById('profile-email');
                    
                    // Check for the non-null email address and photo
                    let photo = (photo_1 !== null) ? photo_1 : photo_2;
                    card.remove();

                    // Add container to the page
                    let quizzesEmpty       = document.createElement('div');
                    quizzesEmpty.classList = 'mdl-card mdl-shadow--2dp';
                    quizzesEmpty.id        = 'dashboard-container';
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
                    let profileDiv = document.createElement('div');
                    let newPhoto   = document.createElement('img');
                    let newEmail   = document.createElement('p');
                    newPhoto       = photo;
                    newEmail       = email;
                    profileDiv.id  = 'profile-div';
                    newPhoto.id    = 'profile-image-new';
                    newEmail.id    = 'profile-email';
                    emptyContainer.appendChild(profileDiv);
                    profileDiv.appendChild(newPhoto);
                    profileDiv.appendChild(newEmail);

                    // Create the upload button
                    let uploadDiv = document.createElement('div');
                    let uploadMsg = document.createElement('p');
                    let btnLabel  = document.createElement('label');
                    let uploadBtn = document.createElement('input');

                    uploadDiv.id          = 'upload-div';
                    uploadMsg.id          = 'upload-txt';
                    uploadMsg.textContent = 'Upload a Quiz';
                    btnLabel.id           = 'upload-btn-new';
                    btnLabel.className    = 'btn-style';
                    btnLabel.textContent  = 'Upload';
                    uploadBtn.id          = 'upload-hidden';
                    uploadBtn.className   = 'btn-style';
                    uploadBtn.type        = 'file';
                    uploadBtn.accept      = '.quiz';

                    emptyContainer.appendChild(uploadDiv);
                    uploadDiv.appendChild(uploadMsg);
                    uploadDiv.appendChild(btnLabel);
                    btnLabel.appendChild(uploadBtn);
                    uploadBtn.onchange = uploadFile;

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
function downloadQuiz(tbl, curRow, quizId, event) {
    event.stopPropagation();

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
function uploadFile(e) {
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

            // Create a request to the server route using the uploaded quiz
            let req = new XMLHttpRequest();
            let path = "/quizzes/upload";
            let reqBody = JSON.stringify({quiz: quizUpload});
    
            // Send the file to the server side
            req.open("POST", path, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener("load", () => {
                if (req.status >= 200 && req.status < 400) {
                    let response = JSON.parse(req.responseText);

                    // Check if the table is empty or has rows
                    let table = document.getElementById('recordTable');

                    // If there are no quizzes
                    if (table == null) {
                        // Remove the card and replace it with the no quizzes card
                        let card       = document.getElementById('dashboard-container');
                        let photo_1    = document.getElementById('profile-image');
                        let photo_2    = document.getElementById('profile-image-new');
                        let email      = document.getElementById('profile-email');

                        // Check for the non-null email address and photo
                        let photo = (photo_1 !== null) ? photo_1 : photo_2;
                        card.remove();

                        // Add container to the page
                        let topRowContainer    = document.createElement('div');
                        topRowContainer.id     = 'top-row-container';
                        let quizzesEmpty       = document.createElement('div');
                        quizzesEmpty.classList = 'mdl-card mdl-shadow--2dp';
                        quizzesEmpty.id        = 'dashboard-container';
                        document.getElementById('page-content').appendChild(topRowContainer);
                        topRowContainer.appendChild(quizzesEmpty);

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
                        emptyContainer.classList = 'mdl-card__supporting-text mdl-color-text--grey-600 quiz-content';
                        quizzesEmpty.appendChild(emptyContainer);

                        // Fill the empty quiz container with the user's information
                        let profileDiv  = document.createElement('div');
                        let createPhoto = document.createElement('img');
                        let createEmail = document.createElement('p');
                        createPhoto     = photo;
                        createEmail     = email;
                        profileDiv.id   = 'profile-div';
                        createPhoto.id  = 'profile-image-new';
                        createEmail.id  = 'profile-email';
                        emptyContainer.appendChild(profileDiv);
                        profileDiv.appendChild(createPhoto);
                        profileDiv.appendChild(createEmail);

                        // Create the upload button
                        let uploadDiv = document.createElement('div');
                        let uploadMsg = document.createElement('p');
                        let btnLabel  = document.createElement('label');
                        let uploadBtn = document.createElement('input');

                        uploadDiv.id          = 'upload-div';
                        uploadMsg.id          = 'upload-txt';
                        uploadMsg.textContent = 'Upload a Quiz';
                        btnLabel.id           = 'upload-btn-new';
                        btnLabel.className    = 'btn-style';
                        btnLabel.textContent  = 'Upload';
                        uploadBtn.id          = 'upload-hidden';
                        uploadBtn.className   = 'btn-style';
                        uploadBtn.type        = 'file';
                        uploadBtn.accept      = '.quiz';

                        emptyContainer.appendChild(uploadDiv);
                        uploadDiv.appendChild(uploadMsg);
                        uploadDiv.appendChild(btnLabel);
                        btnLabel.appendChild(uploadBtn);
                        uploadBtn.onchange = uploadFile;

                        // Create the table
                        let newTable       = document.createElement('table');
                        newTable.id        = 'recordTable';
                        newTable.classList = 'mdl-data-table mdl-js-data-table mdl-shadow--2dp';
                        newTable.setAttribute('data-upgraded', ',MaterialDataTable');
                        emptyContainer.appendChild(newTable);

                        // Create the head row
                        let newHead = document.createElement('thead');
                        let headRow = document.createElement('tr');
                        newTable.appendChild(newHead);
                        newHead.appendChild(headRow);
                        

                        for (let i = 0; i < 3; i++) {
                            let newCell = document.createElement('th');
                            headRow.appendChild(newCell);

                            // Assign the correct values to the cell
                            if (i === 0) {
                                newCell.classList   = 'mdl-data-table__cell--non-numeric';
                                newCell.textContent = 'Quiz Name';
                            }
                        }

                        // Create the table body
                        let newBody = document.createElement('tbody');
                        newBody.id  = 'table-body';
                        newTable.appendChild(newBody);
                    }

                    // Add a new row to the table
                    newBody      = document.getElementById('table-body');
                    let newRow = newBody.insertRow(-1);
                    newRow.id  = `rowModal${newBody.rows.length - 1}`;

                    // Create quiz name
                    let newDataCell       = document.createElement('td');
                    newDataCell.classList = 'mdl-data-table__cell--non-numeric';
                    newRow.appendChild(newDataCell);

                    let newCellDiv         = document.createElement('div');
                    newCellDiv.textContent = response.name;
                    newCellDiv.classList   = 'quiz-name';
                    newDataCell.appendChild(newCellDiv);

                    // Download button element
                    let downloadCell      = document.createElement('td');
                    let downloadBtn       = document.createElement('input');
                    downloadBtn.type      = "button";
                    downloadBtn.value     = "Download";
                    downloadBtn.className = "btn-style";
                    downloadBtn.setAttribute('onclick', `downloadQuiz('recordTable', this, '${response._id}', event);`);
                    newRow.appendChild(downloadCell);
                    downloadCell.appendChild(downloadBtn);

                    // Delete button element
                    let deleteCell      = document.createElement('td');
                    let deleteBtn       = document.createElement('input');
                    deleteBtn.type      = "button";
                    deleteBtn.value     = "Delete";
                    deleteBtn.className = "btn-style";
                    deleteBtn.setAttribute('onclick', `deleteQuiz('recordTable', this, '${response._id}', event);`);
                    newRow.appendChild(deleteCell);
                    deleteCell.appendChild(deleteBtn);

                    // Add the modal container
                    let modalContainer       = document.createElement('div');
                    modalContainer.id        = `modal${newBody.rows.length - 1}`;
                    modalContainer.className = 'modal';
                    newBody.appendChild(modalContainer);

                    // Add the modal div
                    let modalDiv       = document.createElement('div');
                    modalDiv.className = 'modal-content';
                    modalContainer.appendChild(modalDiv);

                    // Add quiz content to modal
                    let closeSpan         = document.createElement('span');
                    closeSpan.className   = 'close';
                    closeSpan.innerHTML = '&times;';
                    modalDiv.appendChild(closeSpan);

                    // Register the modal's event listeners
                    createModals();

                    // Add fieldset
                    let newField = document.createElement('fieldset');
                    modalDiv.appendChild(newField);

                    // Add quiz name
                    let quizName          = document.createElement('h5');
                    let tagTitle1         = document.createElement('b');
                    tagTitle1.textContent = 'Quiz Name: ';
                    newField.appendChild(quizName);
                    quizName.appendChild(tagTitle1);
                    quizName.append(response.name);


                    // Add quiz category
                    let quizCategory      = document.createElement('h6');
                    let tagTitle2         = document.createElement('b');
                    tagTitle2.textContent = `Quiz Category: `; 
                    newField.appendChild(quizCategory);
                    quizCategory.appendChild(tagTitle2);
                    quizCategory.append(response.category);

                    // Add quiz time limit
                    let timeLimit         = document.createElement('h6');
                    let tagTitle3         = document.createElement('b');
                    tagTitle3.textContent = `Time Limit: `;
                    newField.appendChild(timeLimit);
                    timeLimit.appendChild(tagTitle3);
                    timeLimit.append(response.timeLimit);

                    // Add quiz question count
                    let quizCount         = document.createElement('h6');
                    let tagTitle4         = document.createElement('b');
                    tagTitle4.textContent = `Number of Questions: `;
                    newField.appendChild(quizCount);
                    quizCount.appendChild(tagTitle4);
                    quizCount.append(response.questions.length);

                    let lineBreak = document.createElement('hr');
                    modalDiv.appendChild(lineBreak);

                    // Create question div and field
                    let questionDiv   = document.createElement('div');
                    let questionField = document.createElement('fieldset');
                    modalDiv.appendChild(questionDiv);
                    questionDiv.appendChild(questionField);

                    // Loop over quiz questions and display them
                    for (let i = 0; i < response.questions.length; i++) {
                        // Display the question number
                        let qCount = document.createElement('h5');
                        qCount.textContent = `Q${i}`;
                        questionField.appendChild(qCount);

                        let singleQuestion = document.createElement('p');
                        questionField.appendChild(singleQuestion);

                        // Call the correct rendering function
                        switch (response.questions[i].quizType) {
                            case 'true-false':
                                renderTF(singleQuestion, response.questions[i]);
                                break;
                            case 'mult-choice':
                                renderMult(singleQuestion, response.questions[i]);
                                break;
                            case 'fill-blank':
                                renderFill(singleQuestion, response.questions[i]);
                                break;
                            case 'check-all':
                                renderChAll(singleQuestion, response.questions[i]);
                                break; 
                        }
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

// Add the event listener
document.getElementById('upload-hidden').onchange = uploadFile;


/* =================== QUESTION RENDERING FUNCTIONS ======================== */

/* Append True/False Question ---------------------------------------------- */
function renderTF(element, question) {
    console.log(question)

    // // Increment the question added index for possible deletion later
    // INITIAL_ORDER++;

    // // Add a new row to display the question
    // let tableRowDisplay = document.createElement('tr');
    // tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    // quiz_display.appendChild(tableRowDisplay);

    // let tableDisplay = document.createElement('td');
    // tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    // tableRowDisplay.appendChild(tableDisplay);

    // // Use the correct question_num value to track the question count
    // let headerDisplay        = document.createElement('h5');
    // headerDisplay.innerText  = "Q" + question_num;
    // tableDisplay.appendChild(headerDisplay);

    // let questionDisplay        = document.createElement('i');
    // questionDisplay.className  = 'question-list';
    // questionDisplay.innerText  = question_text;
    // tableDisplay.appendChild(questionDisplay);

    // let ansTrueDisplay       = document.createElement('li');
    // ansTrueDisplay.id        = 'ansTrueDisplay' + INITIAL_ORDER;
    // ansTrueDisplay.innerHTML = "True " + (tfValue ? "&#x2611" : "");
    // tableDisplay.appendChild(ansTrueDisplay);

    // let ansFalseDisplay         = document.createElement('li');
    // ansFalseDisplay .id         = 'ansFalseDisplay' + INITIAL_ORDER;
    // ansFalseDisplay .innerHTML  = "False " + (tfValue ? "" :  "&#x2611");
    // tableDisplay.appendChild(ansFalseDisplay);

};


/* Append Multiple Choice Question ----------------------------------------- */
function renderMult(element, question) {
    console.log(question)

    // // Increment the question added index for possible deletion later
    // INITIAL_ORDER++;

    // // Add a new row to display the question
    // let tableRowDisplay = document.createElement('tr');
    // tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    // quiz_display.appendChild(tableRowDisplay);

    // let tableDisplay = document.createElement('td');
    // tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    // tableRowDisplay.appendChild(tableDisplay);

    // // Use the correct question_num value to track the question count
    // let headerDisplay        = document.createElement('h5');
    // headerDisplay.innerText  = "Q" + question_num;
    // tableDisplay.appendChild(headerDisplay);

    // let questionDisplay       = document.createElement('i');
    // questionDisplay.innerText = question_text;
    // tableDisplay.appendChild(questionDisplay);

    // // Loop to display the associated number of answer strings
    // for (let i = 0; i < question_answers.length; i++) {
    //     let ansDisplay = document.createElement('li');
    //     ansDisplay.id  = 'ansDisplay' + INITIAL_ORDER;
        
    //     // Add the checkbox to correct answer
    //     if (question_key == i) {
    //         ansDisplay.innerHTML  = question_answers[i] + " &#x2611";
    //     }
    //     else {
    //         ansDisplay.innerHTML  = question_answers[i];
    //     }

    //     // Render the formed answer
    //     tableDisplay.appendChild(ansDisplay);
    // }

};


/* Append Fill in the Blank Question --------------------------------------- */
function renderFill(element, question) {
    console.log(question)

    // // Increment the question added index for possible deletion later
    // INITIAL_ORDER++;

    // // Add a new row to display the question
    // let tableRowDisplay = document.createElement('tr');
    // tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    // quiz_display.appendChild(tableRowDisplay);

    // let tableDisplay = document.createElement('td');
    // tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    // tableRowDisplay.appendChild(tableDisplay);

    // // Use the correct question_num value to track the question count
    // let headerDisplay        = document.createElement('h5');
    // headerDisplay.innerText  = "Q" + question_num;
    // tableDisplay.appendChild(headerDisplay);

    // let questionDisplay1        = document.createElement('i');
    // questionDisplay1.innerText  = `${question_text[0]} `;
    // tableDisplay.appendChild(questionDisplay1);

    // let ansDisplay                  = document.createElement('i');
    // ansDisplay.innerText            = `${question_key}`;
    // ansDisplay.style.textDecoration = 'underline';
    // tableDisplay.appendChild(ansDisplay);

    // let questionDisplay2        = document.createElement('i');
    // questionDisplay2.innerText  = ` ${question_text[1]}`;
    // tableDisplay.appendChild(questionDisplay2);

};


/* Append Check all Question ----------------------------------------------- */
function renderChAll(element, question) {
    console.log(question)

    // // Increment the question added index for possible deletion later
    // INITIAL_ORDER++;

    // // Add a new row to display the question
    // let tableRowDisplay = document.createElement('tr');
    // tableRowDisplay.id  = "tableRow_" + INITIAL_ORDER;
    // quiz_display.appendChild(tableRowDisplay);

    // let tableDisplay = document.createElement('td');
    // tableDisplay.id  = "tableDisplay_" + INITIAL_ORDER;
    // tableRowDisplay.appendChild(tableDisplay);

    // // Use the correct question_num value to track the question count
    // let headerDisplay        = document.createElement('h5');
    // headerDisplay.innerText  = "Q" + question_num;
    // tableDisplay.appendChild(headerDisplay);

    // let questionDisplay       = document.createElement('i');
    // questionDisplay.innerText = question_text;
    // tableDisplay.appendChild(questionDisplay);

    // // Loop to display the associated number of answer strings
    // for (let i = 0; i < question_answers.length; i++) {
    //     let ansDisplay = document.createElement('li');
    //     ansDisplay.id  = 'ansDisplay' + INITIAL_ORDER;
        
    //     // No boxes checked
    //     ansDisplay.innerHTML = question_answers[i]; 

    //     // Add the checkbox to correct answers
    //     for (let j = 0; j < question_key.length; j++) {
    //         if (question_key[j] == i) {
    //             ansDisplay.innerHTML = question_answers[i] + " &#x2611";
    //             break;
    //         }
    //         else {
    //             ansDisplay.innerHTML = question_answers[i];
    //         }
    //     }

    //     // Render the formed answer
    //     tableDisplay.appendChild(ansDisplay);
    // }

};
