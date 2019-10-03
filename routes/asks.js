const router = require("express").Router();

const {
    requireSignin,
    isAdmin
} = require("../controllers/auth");

const {
    postAsk
} = require("../controllers/asks");

router.post("/new", requireSignin, isAdmin, postAsk)


// router.param("blogId", requestRelatedBlogId);

module.exports = router;