const mongoose = require("mongoose");

let Schema = mongoose.Schema({
    user:{type:String,index:true},
    ttl:{type:Number,index:true},
    token:{type:String,index:true}
})

module.exports = mongoose.model("Session",Schema);