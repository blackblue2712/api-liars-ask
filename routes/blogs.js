const router = require("express").Router();

const {
    requireSignin,
    isAdmin
} = require("../controllers/auth");

const {
    getBlogs,
    postWriteBlog
} = require("../controllers/blogs");

router.get("/", getBlogs);
router.post("/write", requireSignin, isAdmin, postWriteBlog)

module.exports = router;