const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

/******************************************************************************
**  Description:  Mongodb / Mongoose data model for the Job Posting entity
******************************************************************************/

const jobpostingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    associatedQuiz : [{
        quiz_id : mongoose.Schema.Types.ObjectId,
        employer_id : mongoose.Schema.Types.ObjectId
    }],
    quizResponses : [{
        quiz_response_id : mongoose.Schema.Types.ObjectId,
        quiz_id : mongoose.Schema.Types.ObjectId,
        candidate_id : mongoose.Schema.Types.ObjectId,
        candidateAnswers: [String],
        quizScore: mongoose.Schema.Types.Decimal128
    }]
});

module.exports = mongoose.model('JobPosting', jobpostingSchema);
