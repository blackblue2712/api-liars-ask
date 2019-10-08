const express = require("express");
const router = express.Router();

const {
    getUsers,
    requrestRelatedUserId,
    updateStoryUser,
    updateInfoUser,
    getInfoLoggedUser,
    getUploadImages,
    postUploadImage,
    putDeleteUploadedImage
} = require("../controllers/users");

const { requireSignin } = require("../controllers/auth");

router.get("/", getUsers);

router.get("/:userId", requireSignin, getInfoLoggedUser);
router.put("/story/:userId", updateStoryUser);
router.put("/info/:userId", requireSignin, updateInfoUser);
router.get("/images-gallery/:userId", getUploadImages);
router.post("/images-gallery/new/:userId", requireSignin, postUploadImage);
router.put("/images-gallery/delete/:userId", requireSignin, putDeleteUploadedImage);

router.param("userId", requrestRelatedUserId);
module.exports = router;