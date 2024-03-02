const jwt = require('jsonwebtoken');
  const Astrologer = require("../models/astrologerModel.js");
  const Client = require('../models/clientModel.js')


exports.verification =(Client,idField)=>async(req,res, next)=>{
    try{
      let token = req.header("Authorization")
      if(token && token.startsWith("Bearer ")){
        token = token.slice(7,token.length).trimLeft();
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("verified", verified);

        if(!verified){
            return res.status(401).json({error:"Unauthorized - Invalid Token "})
        }
        const user = await Client.findById(verified[idField])
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        req.user = user
        next()
      }
      else{
        res.status(403).send("Access denied")
      }
    }catch(err){
        console.log("Error in aunthendication middleware: ", err.message);
       res.status(500).json({error:"Internal server error"})
    }
  } 

  exports.astrologerVerification = async(req,res, next)=>{
    try{
      let token = req.header("Authorization")
      if(token && token.startsWith("Bearer ")){
        token = token.slice(7,token.length).trimLeft();
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        console.log("verified", verified);

        if(!verified){
            return res.status(401).json({error:"Unauthorized - Invalid Token "})
        }
        const astrologer = await Astrologer.findOne(verified.mobilePrimary)
        if(!astrologer){
            return res.status(404).json({error:"astrologer not found"})
        }
        req.astrologer = astrologer
   
        next()
      }
      else{
        res.status(403).send("Access denied")
      }
    }catch(err){
        console.log("Error in aunthendication middleware: ", err.message);
       res.status(500).json({error:"Internal server error"})
    }
  } 

