const express = require('express')
const errorMiddleware = require('./middlewares/error.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv =require('dotenv')
const path = require('path')
const cookieParser =require('cookie-parser');
const requestIp = require('request-ip');
dotenv.config({path:path.join(__dirname,'process.env')})
const app = express()

app.use(express.json());
app.use(cookieParser());
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
const packages = require('./routes/Package.js')
const method = require('./routes/Method.js')
const language = require('./routes/language.js')
const product = require('./routes/Product.js')
const course = require('./routes/Course.js')
const category = require('./routes/Category.js')
const chat = require('./routes/Chat.js')
const message = require('./routes/message.js')
const bonus = require('./routes/bonus.js')
const courseCategory = require('./routes/courseCategory.js')
const token = require('./routes/token.js')

app.use('/api/v1',user)
app.use('/api/v1',astrologer)
app.use('/api/v1',admin);
app.use('/api/v1',packages);
app.use('/api/v1',method);
app.use('/api/v1',language);
app.use('/api/v1',product);
app.use('/api/v1',category);
app.use('/api/v1',course);
app.use('/api/v1',courseCategory)
app.use('/api/v1',chat)
app.use('/api/v1',message)
app.use('/api/v1',bonus)
app.use('/api/v1',token)







app.use(errorMiddleware)
module.exports = app
