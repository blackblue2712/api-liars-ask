const router = require("express").Router();

const {
    postAddTag
} = require("../controllers/tags");

const {
    requireSignin,
    isAdmin
} = require("../controllers/auth");

router.post("/add", requireSignin, isAdmin, postAddTag);

module.exports = router;