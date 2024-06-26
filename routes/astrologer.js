const express = require("express");

const {
  registerAstrologer,
  getAllAstrologers,
  deleteAstrologer,
  updateAstrologer,
  activeAstrologer,
  getAstrologerPhone,
  getAstrologer,
  logoutAstrologer,
  getAstrologerByCategory,
  getAstrologerByLanguage,
  availableAstrologer,
  getAvailableAstrologerByCall,
  getAvailableAstrologerByChat,
  searchAstrologerByName,
  getAstrologerForSidebar,
  isBusyAstrologer,
  getChatDetailWithUser,
  paytoAstrologer
} = require("../controllers/astrologerController");

const multer = require("multer");
const router = express.Router();
const path = require("path");
const { verification,astrologerVerification } = require("../middlewares/authenticate");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // You can choose the destination based on the file type or other conditions
    if (file.fieldname === "certificatePic") {
      cb(null, path.join(__dirname, "..", "uploads/certificates"));
    } else if (file.fieldname === "profilePic") {
      cb(null, path.join(__dirname, "..", "uploads/profilepic"));
    } else if (file.fieldname === "aadharPic") {
      cb(null, path.join(__dirname, "..", "uploads/aadharImage"));
    } else if (file.fieldname === "panPic") {
      cb(null, path.join(__dirname, "..", "uploads/pancardImage"));
    } else {
      cb(new Error("Invalid fieldname for destination"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


router.route("/astrologer/register").post(
  upload.fields([{ name: "certificatePic" }, { name: "profilePic" },{ name: "aadharPic" },{ name: "panPic" }]),

registerAstrologer
);


router.route("/astrologer/allAstrologers").get( getAllAstrologers);
router.route("/astrologer/getAstrologer/:id").get(getAstrologer);
router.route("/astrologer/delete/:id").delete(deleteAstrologer);
router.route("/astrologer/update/:id").put(
  upload.fields([{ name: "certificatePic" }, { name: "profilePic" },{ name: "aadharPic" },{ name: "panPic" }]),

updateAstrologer);
// router.route("/astrologer/state/:id").put(activeAstrologer);
router.route("/astrologer/phoneNo").get(getAstrologerPhone)
router.route("/astrologers").get(astrologerVerification,getAstrologerForSidebar)

router.route("/astrologer/available/:id").post(astrologerVerification, availableAstrologer)
router.route("/astrologer/isBusy").post(isBusyAstrologer)
router.route("/astrologer/pay_to_astrologer").post(paytoAstrologer)

router.route("/astrologer/chatDetail").post(getChatDetailWithUser)
router.route("/astrologer/call_available").get(getAvailableAstrologerByCall)
router.route("/astrologer/chat_available").get(getAvailableAstrologerByChat)
router.route("/astrologer/category").get(getAstrologerByCategory)
router.route("/astrologer/name").get(searchAstrologerByName)
router.route("/astrologer/language").get(getAstrologerByLanguage)
router.route("/astrologer/logoutAstrologer").get(logoutAstrologer)


module.exports = router;
