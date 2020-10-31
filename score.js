//score calculation
function calculate_score(body){
    return new Promise(function(resolve,reject) {
        var key = body;
        var key_length = Object.keys(key).length; 

        resolve(key);
    });
}

module.exports = { calculate_score };