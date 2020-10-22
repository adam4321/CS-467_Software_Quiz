const mongoose = require('mongoose');

const employerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    name: String,
    jobPostings: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('Employer', employerSchema);