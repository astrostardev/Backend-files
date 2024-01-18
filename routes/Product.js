const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const multer = require("multer");
const path = require("path");
const { createProduct, showProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController')

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


  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        console.log('Destination Path:', path.join(__dirname, '..', 'uploads', 'ProductImages'));
        cb(null, path.join(__dirname, '..', 'uploads', 'ProductImages'));
      },
      filename: function (req, file, cb) {
        const timestamp = Date.now();
        console.log('Uploading File:', file.originalname);
        cb(null, `${file.originalname}`);
      },
    }),
  });
    
router.route('/product/create').post(upload.array('images'),createProduct)
router.route('/product/show').get(showProducts)
router.route('/product/get/:id').get(getProduct)
router.route('/product/update/:id').put(updateProduct)
router.route('/product/delete/:id').delete(deleteProduct)


module.exports = router