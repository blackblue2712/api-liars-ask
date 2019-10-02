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
    putEditAcm
} = require("../controllers/announcements")

router.get("/", getAnnouncements);
router.post("/new", postAnnouncement);
router.get("/:acmId", getSingleAcm);
router.put("/edit/:acmId", putEditAcm);

router.param("acmId", requestRelatedAcmId);

module.exports = router;