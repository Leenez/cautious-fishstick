const mongoose = require("mongoose");
const config = require("../../config")

const url = `mongodb+srv://${config.mongo_user}:${config.mongo_password}@${config.mongo_url}/${config.database}?retryWrites=true&w=majority`

const openMongooseConnection = async () => {
    try {
        let connection = await mongoose.connect(url);
        console.log("Connected to MongoDB");
        return connection
    } catch (err) {
        console.log("Connection to MongoDB failed",err);
    }
}

module.exports = {openMongooseConnection};
