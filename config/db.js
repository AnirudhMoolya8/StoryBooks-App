const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)  //connecting to mongo server through config.env file
        console.log(`MongoDB Connected: ${conn.connection.host}`)  //print to console that it is connected to mongo server
    } catch (err) {
        console.error(err)  //print error if connection is not successfull 
        process.exit(1)  //exit the program once error is occurred
    }
}



module.exports = connectDB