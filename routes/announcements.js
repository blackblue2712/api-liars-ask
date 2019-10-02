const router = require("express").Router();
const {
    requireSignin,
    isAdmin
} = require("../controllers/auth");

const {
    requestRelatedAcmId,
    postAnnouncement,
    getAnnouncements,
    getSingleAcm,
} = require("../controllers/announcements")

router.get("/", getAnnouncements);
router.post("/new", postAnnouncement);

router.get("/:acmId", getSingleAcm);

router.param("acmId", requestRelatedAcmId);

module.exports = router;