const express = require("express");
const jwt = require('jsonwebtoken')
const app = express()
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
  getAstrologerByLanguage
} = require("../controllers/astrologerController");

const multer = require("multer");
const router = express.Router();
const path = require("path");

// app.use('/uploads', express.static('uploads'));


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // You can choose the destination based on the file type or other conditions
      if (file.fieldname === "certificates") {
        cb(null, path.join(__dirname, "..", "uploads/certificates"));
      } else if (file.fieldname === "profilePic") {
        cb(null, path.join(__dirname, "..", "uploads/profilepic"));
      } else {
        cb(new Error("Invalid fieldname for destination"));
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});
const verification = async(req, res, next)=>{
  try{
    let token = req.header("Authorization")
    if(token && token.startsWith("Bearer ")){
      token = token.slice(7,token.length).trimLeft();
      const verified = jwt.verify(token,process.env.JWT_SECRET)
      req.user = verified
      console.log(verified);
      next()
    }
    else{
      res.status(403).send("Access denied")
    }
  }catch(err){
     res.status(400).json({msg:err.message})
  }
}
router.route("/astrologer/register").post(
  upload.fields([{ name: "certificates" }, { name: "profilePic" }]),

registerAstrologer
);


router.route("/astrologer/allAstrologers").get(getAllAstrologers);
router.route("/astrologer/getAstrologer/:id").get(getAstrologer);
router.route("/astrologer/delete/:id").delete(verification,deleteAstrologer);
router.route("/astrologer/update/:id").put(
upload.fields([{ name: "certificates" }, { name: "profilePic" }]),
updateAstrologer);
// router.route("/astrologer/state/:id").put(activeAstrologer);
router.route("/astrologer/phoneNo").get(getAstrologerPhone)
router.route("/astrologer/category").get(getAstrologerByCategory)
router.route("/astrologer/language").get(getAstrologerByLanguage)
router.route("/astrologer/logoutAstrologer").get(logoutAstrologer)


module.exports = router;
