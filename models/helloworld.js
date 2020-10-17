const mongoose = require('mongoose');

const helloworldSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String
});

module.exports = mongoose.model('HelloWorld', helloworldSchema);