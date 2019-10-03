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
    putEditBlog
} = require("../controllers/blogs");

router.get("/", getBlogs);
router.get("/all", getAllBlogs);
router.post("/write", requireSignin, isAdmin, postWriteBlog)
router.get("/:blogId", getSingleBlog);
router.put("/edit/:blogId", requireSignin, isAdmin, putEditBlog);

router.param("blogId", requestRelatedBlogId);

module.exports = router;