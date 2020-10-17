const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    questions : [{
        quizQuestion: String,
        quizAnswers: [String],
        quizKey: String,
        quizType: String
    }]
});

module.exports = mongoose.model('Quiz', quizSchema);