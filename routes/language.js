const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { createLanguage, showLanguage, updateLanguage, deleteLanguage, getLanguage } = require('../controllers/languageController')

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
router.route('/language/create').post(createLanguage)
router.route('/language/show').get(showLanguage)
router.route('/language/get/:id').get(getLanguage)
router.route('/language/update/:id').put(updateLanguage)
router.route('/language/delete/:id').delete(deleteLanguage)


module.exports = router