const mongoose = require('mongoose');
const GridFSBucket = mongoose.mongo.GridFSBucket;

const connectDatabase = ()=>{

    mongoose.connect(process.env.DB_LOCAL_URI).then(con=>{
        console.log(`MongoDB is connected to the host: ${con.connection.host}`);
        const audioBucket = new GridFSBucket(mongoose.connection, {
            bucketName: "audioFiles",
          });
    }).catch((err)=>{
        console.log(err);
    })

}
module.exports = connectDatabase;