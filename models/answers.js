const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const answerSchema = new Schema ({
    body: String,
    votes: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    owner: {
        type: ObjectId,
        ref: "users"
    },
    created: {
        type: Date,
        default: Date.now
    }

})

const answers = mongoose.model("answers", answerSchema);
module.exports = answers;