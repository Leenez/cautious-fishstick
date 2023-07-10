const mongoose = require("mongoose");

let Schema = mongoose.Schema({
    date:{type:Date, default: Date.now, index:true},
    user:{type:String,index:true},
    message:{type:String,index:true}
})

module.exports = mongoose.model("Message",Schema);