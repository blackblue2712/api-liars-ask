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
    putEditAcm,
    deleteEditAcm
} = require("../controllers/announcements")

router.get("/", getAnnouncements);
router.post("/new", requireSignin, isAdmin,postAnnouncement);
router.get("/:acmId", getSingleAcm);
router.put("/edit/:acmId", requireSignin, isAdmin, putEditAcm);
router.delete("/delete/:acmId", requireSignin, isAdmin, deleteEditAcm);

router.param("acmId", requestRelatedAcmId);

module.exports = router;