const Ques = require("../models/questions");

module.exports.postAsk = (req, res) => {
    let ask = new Ques(req.body);
    ask.anonymousTags = req.body.tagsnameArray;
    ask.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (ask question)"} );
        return res.status(200).json( {message: "Done"} )
    });
}
