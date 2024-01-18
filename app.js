const express = require('express')
const app = express();
const errorMiddleware = require('./middlewares/error.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv =require('dotenv')
const path = require('path')
const requestIp = require('request-ip');
dotenv.config({path:path.join(__dirname,"config/config.env")})

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use((req,res,next)=>{
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next()
})
app.use(requestIp.mw());
app.use('/uploads', express.static(path.join(__dirname,'uploads') ) )

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
const user = require('./routes/User')
const astrologer = require('./routes/astrologer')
const admin = require('./routes/Admin')
const package = require('./routes/Package.js')
const method = require('./routes/Method.js')
const language = require('./routes/language.js')
const product = require('./routes/Product.js')
const course = require('./routes/Course.js')
const category = require('./routes/Category.js')
const courseCategory = require('./routes/courseCategory.js')





app.use('/api/v1',user)
app.use('/api/v1',astrologer)
app.use('/api/v1',admin);
app.use('/api/v1',package);
app.use('/api/v1',method);
app.use('/api/v1',language);
app.use('/api/v1',product);
app.use('/api/v1',category);
app.use('/api/v1',course);
app.use('/api/v1/',courseCategory)





app.use(errorMiddleware)
module.exports = app
