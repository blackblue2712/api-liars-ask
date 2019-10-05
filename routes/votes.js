
const router = require("express").Router();
const {
    voteUp,
    VoteDown,
    requestRelatedAnswerId,
    
} = require("../controllers/votes");

router.post("/answer/voteUp/:ansId", voteUp);
// router.post("/answer/votDown/:ansId", VoteDown);

router.param("ansId", requestRelatedAnswerId);

module.exports = router;