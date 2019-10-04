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
} = require("../controllers/asks");

router.get("/questions", getQuestions);
router.get("/questions/:quesId", getSigleQuestion);
router.post("/new", requireSignin, isAdmin, postAsk);


router.param("quesId", requestRelatedQuestionId);

module.exports = router;