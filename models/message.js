const mongoose = require("mongoose");

let Schema = mongoose.Schema({
    date:Date,
    user:{type:String,index:true},
    message:String,
})

module.exports = mongoose.model("Message",Schema);