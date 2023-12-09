
const Client = require('../models/clientModel.js');
const dotenv = require('dotenv');
const path = require('path')
const connectDatabase = require('../config/database.js');


dotenv.config({path:path.join(__dirname,"../config/config.env")})
connectDatabase();

const seedProducts = async()=>{
    try{
        await Client.deleteMany();
       console.log('All user deleted');
  
  }
catch(error){
  console.log(error.message);
}
process.exit();
}
seedProducts();