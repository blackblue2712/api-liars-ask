const router = require("express").Router();

const {
    requireSignin,
    isAdmin
} = require("../controllers/auth");

const {
    getQuestions,
    postAsk,
    requestRelatedQuestionId,
    getSigleQuestion,
    postAnswer,
    updateQuestionAfterPostAnswer
} = require("../controllers/asks");

router.get("/questions", getQuestions);
router.get("/questions/:quesId", getSigleQuestion);
router.post("/new", requireSignin, isAdmin, postAsk);
router.post("/answer/new", requireSignin, postAnswer, updateQuestionAfterPostAnswer);


router.param("quesId", requestRelatedQuestionId);

module.exports = router;