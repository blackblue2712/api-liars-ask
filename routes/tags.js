const router = require("express").Router();

const {
    getTags,
    postAddTag
} = require("../controllers/tags");

const {
    requireSignin,
    isAdmin
} = require("../controllers/auth");

router.get("/", getTags);
router.post("/add", requireSignin, isAdmin, postAddTag);

module.exports = router;