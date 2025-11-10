const mongoose = require("mongoose");


const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDb Connected SuccessFully");


    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDb;