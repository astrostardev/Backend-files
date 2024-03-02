const {server} = require('./socket/socket')
require('dotenv').config();
const app = require("./app")
const connectDatabase = require('./config/database')
connectDatabase();
// server.on('request', app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> {
    console.log(` My Server listeting to the port   ${process.env.PORT} in ${process.env.NODE_ENV}`);
})

