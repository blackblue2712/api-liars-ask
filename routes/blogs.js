const router = require("express").Router();

const {
    requireSignin,
    isAdmin
} = require("../controllers/auth");

const {
    getBlogs,
    getAllBlogs,
    postWriteBlog,
    getSingleBlog,
    requestRelatedBlogId
} = require("../controllers/blogs");

router.get("/", getBlogs);
router.get("/all", getAllBlogs);
router.post("/write", requireSignin, isAdmin, postWriteBlog)
router.get("/:blogId", getSingleBlog);

router.param("blogId", requestRelatedBlogId);

module.exports = router;