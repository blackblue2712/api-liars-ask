
const router = require("express").Router();
const {
    voteUp,
    VoteDown,
    requestRelatedAnswerId,
    
} = require("../controllers/votes");

router.post("/answer/voteUp/:ansId", voteUp);

router.param("ansId", requestRelatedAnswerId);

module.exports = router;