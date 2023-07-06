const express = require("express")
const userLastSeenModel = require("../models/userlastseen");
const messageModel = require("../models/message")

let router = express.Router()

router.post("/msgs",async (req,res) => {
    try {
        const currentDate = Date.now();
        let lastSeen = await userLastSeenModel.findOne({ "user" : req.body.user });
        lastSeen = lastSeen.lastseen;
        await userLastSeenModel.updateOne({ "user": req.body.user }, { "lastseen": currentDate });
        const messages = await messageModel.find({ "date" : { $gte : lastSeen } });
        return res.status(200).json(messages);
    } catch(err) {
        console.log(err)
        return res.status(500).json({"Message":"Internal server error"})
    }
})

router.post("/msg", (req,res) => {
    const currentDate = Date.now();
    try {
        let message = new messageModel({
           "date":currentDate,
           "user":req.body.user,
           "message":req.body.message
        })
        message.save()
        return res.status(200).json({"Message":"Success"});
    } catch(err) {
        console.log(err);
        return res.status(500).json({"Message":"Internal server error"});
    }
})

module.exports = router