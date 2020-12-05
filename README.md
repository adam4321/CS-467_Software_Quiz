## OSU 467 Capstone Group Project

Software Quiz group project for Oregon State University. It is
intended to replace Survey Monkey as a tool to email quizzes to
job applicants.

It can be run by cloning the project and then setting up the
necessary Google Oauth2 credentials in the GCP dashboard and
adding those credentials in a file called credentials.js.

Then just call 'npm install' and call 'node app.js'!

### SIGNING IN

The application can be reached at this [link](https://softwarecustomquiz.herokuapp.com/login).

Two sign in options exist:
1) Using your Google (Gmail) account
2) Using your Facebook account

Click on the option of your choice and accept the conditions from
your choice of login. Upon return to the site you will be at the 
site's homepage. You will be greeted with a greetings message 
with your name and the email linked to the login method that you
chose. 

### Home

On the Home page or dashboard of the website 
you will see multiple cards for different actions. The first  
card labelled Home, is where sending an email to a potential candidate 
occurs. If one or multiple JobPostings have been created, then the 
first dropdown will populate with available JobPostings. After 
selecting one, then can enter in the first, last name and email of 
a prospective candidate. Then pressing SUBMIT will send an email. 
Provided the email entered exists, the recipient will receive a 
one-time hashed quiz link to a QuizSoft quiz associated with 
the selected JobPosting. 

#### Inbox

On the card labelled Inbox, the mail icon has badge icon 
to indicate missed responses in the JobPosting page of the 
web application. Clicking the mail icon will link to 
the JobPosting page. If there was a badge icon it will 
disappear after checking the JobPosting page. 

#### Account

On the card labelled Account, the button DELETE BUTTON 
will delete the currently logged in user account and all data associated 
with it. Upon deletion, the user will be redirected to the sign in page. 

### Quiz Creation

On the top right portion of the page you will see five buttons
one of which being "QuizBuilder" click on this button. This is 
the start of the quiz building process. You will see three 
categories 
Quiz Name: The name of the quiz

Category: Setting the cateogry the quiz will fall into.
E.g., C++, C#, Javascript, Networking, IT Help Desk etc.

Time Limit (minutes): A set amount of time the quiz recipient 
(job candidate) will have to take the quiz. 

All three fields must be filled out prior to proceeding to build
the quiz. Once all three fields are filled in hit the "START
BUILDING QUIZ" button.

If you created accidentally created a quiz you can click the 
CANCEL BUILD and you will be taken back to the quiz creation
page you just left. NOTE: None of your work will be saved if you
click CANCEL BUILD so be sure you do indeed want to cancel 
building the quiz. 

You will have four types of questions that can be placed on the 
quiz. True/false, multiple choice, fill in the blank and choose
all that apply. Regardless of which type of question you choose
you will be then prompted to enter a question. 

##### True / False

True and False choices will be displayed for you 
under the question you entered. Please choose which answer is
the CORRECT answer. 


##### Multiple Choice

Initially you will have only one answer input available. You 
can add another by clicking the plus symbol (+) or remove an 
answer option by clicking the subtraction symbol(-). You must 
have at least one answer in order to add this question to your 
quiz. Add the desired amount of answers and click the circle 
next to which answer is the correct answer. 

##### Fill in the blank

You will have two parts to your question here the section 
before the blank and the section of the question after the 
blank. An example is given below.

Question before the blank:
Complete the following Oregon 

Question after the blank:
University

What the question will look like
Complete the following Oregon ________ University.

When entering the answer to this question note that if the 
quiz taker's answer does not match the answer that you put in 
exactly it will be graded as incorrect.

##### All That Apply

Initially you will have only one answer input available. You 
can add another by clicking the plus symbol (+) or remove an 
answer option by clicking the subtraction symbol(-). You can 
have as many answers as you like but must have at least one.
Once you have entered all the possible answer choices click
the box(es) to the left of the answers that you wish to mark
as correct.

As you enter the questions they will appear above where you select
that type of question you would like to ask. If you entered a question
by mistake you can delete it by clicking the delete button next to
the question you wish to remove. 

Once you have entered all the questions that will make up the quiz
you can click the SUBMIT QUIZ button in order to save the quiz. 

### MyQuizzes

In this section you will be able to see the quizzes that you 
have previously saved. The user can click on a row in the table to
view the quiz as a modal. There is a button available in each row to
delete a quiz or to download a quiz. There is also a button on the
page to upload a quiz which has previously been downloaded. The
quizzes are saved with .quiz as the file extension.

### JobPostings

In this section you will be able to create a JobPosting and 
see previously created JobPostings in the table. 

#### Create JobPosting

The option to create a JobPosting is accessed by the CREATE button 
which will redirect to the JobPosting builder page. 
Assuming quizzes have already been created for the account 
there will be a dropdown with quizzes populated. Other required 
fields include JobPosting title, description, message text 
(for the email message body). Clicking the button 
BUILD JOB POSTING will create a new JobPosting. 

#### See JobPosting Details

Provided you have JobPostings created and candidates have 
taken the associated quiz, then the number of responses will 
also be shown. Clicking on a JobPosting row will redirect to the 
Ranking page, showing the canidates ranked by highest score 
then by the time they submitted the quiz. Time is used to break ties, 
the most recent responses are positioned above in this case. 
However, clicking on a JobPosting in the table with 
no responses will show the Ranking page that displays No 
Rankings Yet.

#### See Ranking Details

On the Ranking page there will be a table that shows the 
candidate responses in order of highest score then by time. 
Clicking a Candidate row will show the candidate's quiz 
marked up to show the correct and incorrect answers. 
On this page there is another button with a pie chart symbol 
labelled Graphic Metrics. This will take you to the Graphics page. 

#### See Graphic Metrics

On the Graphics page there are two cards. The first card labelled 
Time Taken shows the breakdown of time taken. For example, the 
percentage of candidates who took the quiz in 0, 1 and 2 minutes. 
The second card labelled Scores, displays a histogram of the 
candidate scores and their frequencies for the given JobPosting. 

### Taking a QuizSoft Quiz

From a Candidate's perspective. 
After receiving an email form QuizSoft there is an option to 
click the hashed link to take a quiz on QuizSoft. 

#### Start Quiz

Clicking START will begin the countdown timer for the quiz 
and take you to the Quiz page with the list of questions and options. 

#### Take Quiz

The Quiz page display a countdown timer that updates each second. 
When the timer reaches zero (00:00) the quiz is automatically submitted. 
Refreshing the page will not reset the timer but will reset the data entered 
for each question. 
You can choose to answer as many questions, as you want and the 
final field is for optional comments that are used for sending a message 
to the grader of the quiz or assumptions orexplanations. 

Clicking the SUBMIT button will post all the data entered on the Quiz page. 
Navigating off the page will also not reset the timer. The quiz cannot be 
taken more than once for a given quiz link.  

#### Quiz Submitted

After submitting the quiz, a page will display that says Quiz 
Submitted. Additionally, the time taken in minutes will be displayed 
below. 

## Released under MIT License

Copyright (c) 2020 Kevin Hill, Adam Slusser, Adam Wright.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
