/******************************************************************************
**  Description:  MY QUIZZES PAGE - client side javascript file that 
**
**  Contains:     deleteQuiz   
******************************************************************************/

// Function to delete a quiz and update the table -------------------------- */

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
                console.error("Delete request error");
            }
        });

        req.send(reqBody);
    }
} 
