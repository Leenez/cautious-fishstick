const mongoose = require("mongoose");

let Schema = mongoose.Schema({
    user:{type:String,unique:true, index:true},
    lastseen:{type:Date, default: Date.now, index:true}
})

module.exports = mongoose.model("UserLastSeen",Schema);