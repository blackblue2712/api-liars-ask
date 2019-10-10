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
    updateQuestionAfterPostAnswer,
    getYourQuestions,
    putUpdateQuestion
} = require("../controllers/asks");

router.get("/questions", getQuestions);
router.get("/questions/:quesId", getSigleQuestion);
router.put("/questions/edit/:quesId", putUpdateQuestion);
router.get("/your-questions/", getYourQuestions);
router.post("/new", requireSignin, postAsk);
router.post("/answer/new", requireSignin, postAnswer, updateQuestionAfterPostAnswer);


router.param("quesId", requestRelatedQuestionId);

module.exports = router;