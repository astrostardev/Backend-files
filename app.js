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

const user = require('./routes/User')
const astrologer = require('./routes/astrologer')
const admin = require('./routes/Admin')

app.use('/api/v1',user)
app.use('/api/v1',astrologer)
app.use('/api/v1',admin);

app.use(errorMiddleware)
module.exports = app
