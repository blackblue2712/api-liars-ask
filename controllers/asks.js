const Ques = require("../models/questions");

module.exports.postAsk = (req, res) => {
    let ask = new Ques(req.body);
    ask.anonymousTags = req.body.tagsnameArray;
    ask.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (ask question)"} );
        return res.status(200).json( {message: "Done"} )
    });
}

module.exports.getQuestions = (req, res) => {
    Ques.find({})
        .sort({created: -1})
        .exec( (err, ques) => {
            if(err) return res.status(400).json( {message: "Error occur (get questions)"} );
            return res.status(200).json( {message: `${ques.length} questions loaded`, payload: ques} );
        });
}

module.exports.requestRelatedQuestionId = async (req, res, next, id) => {
    await Ques.findById(id, (err, ques) => {
        if(err || !ques) return res.status(200).json( {message: "Error occur (get single question)"} );
        req.quesInfo = ques;
    });
    next();
}

module.exports.getSigleQuestion = (req, res) => {
    return res.status(200).json(req.quesInfo);
}