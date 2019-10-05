const Ques = require("../models/questions");
const Answer = require("../models/answers");

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

module.exports.requestRelatedQuestionId = (req, res, next, id) => {
    Ques
        .findById(id)
        .populate({
            path: "answers",
            populate: {
                path: "owner",
                select: "email photo _id fullname"
            }
        })
        .exec( (err, ques) => {
            if(err || !ques) return res.status(200).json( {message: "Error occur (get single question)"} );
            req.quesInfo = ques;
            next();
        })
}

module.exports.getSigleQuestion = (req, res) => {
    return res.status(200).json(req.quesInfo);
}

module.exports.postAnswer = async (req, res, next) => {
    console.log(req.body.userId);
    let { body, userId } = req.body;
    let answer = new Answer( {body, owner: userId} );
    await answer.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (add answer)"} );
        req.answerId = result._id;
    })
    next();
}

module.exports.updateQuestionAfterPostAnswer = (req, res) => {
    let { quesId } = req.body;
    console.log(req.body);
    Ques.findById(quesId, (err, ques) => {
        if(err || !ques) {
            return res.status(400).json( {message: "Can't find question"} );
        } else {
            ques.answers.push(req.answerId);
            ques.save( (err, result) => {
                if(err) return res.status(400).json( {message: "Error occur (push answer)"} );
                return res.status(200).json( {message: "Your answer added"} );
            });
        }
    });
}

module.exports.getAnswers = (req, res) => {

}