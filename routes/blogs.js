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
    requestRelatedBlogId,
    putEditBlog,
    getYourBlogs
} = require("../controllers/blogs");

router.get("/", getBlogs);
router.get("/all", getAllBlogs);
router.post("/write", requireSignin, postWriteBlog)
router.get("/your-blogs", getYourBlogs);
router.get("/:blogId", getSingleBlog);
router.put("/edit/:blogId", requireSignin, putEditBlog);

router.param("blogId", requestRelatedBlogId);

module.exports = router;