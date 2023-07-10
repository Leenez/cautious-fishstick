const express = require("express")
const userLastSeenModel = require("../models/userlastseen");
const messageModel = require("../models/message")
const chatGpt = require ("../middleware/chatgpt")

let router = express.Router()

router.post("/msgs",async (req,res) => {
    try {
        let lastSeen = await userLastSeenModel.findOne({ "user" : req.body.user });
        lastSeen = lastSeen.lastseen;
        await userLastSeenModel.findOneAndRemove({ "user" : req.body.user });
        const lastSeenNew = new userLastSeenModel({
            "user":req.body.user,
         })
        await lastSeenNew.save()
        const messages = await messageModel.find({ "date" : { $gte : lastSeen } });
        return res.status(200).json(messages);
    } catch(err) {
        console.log(err)
        return res.status(500).json({"Message":"Internal server error"})
    }
})

router.post("/msg", async (req,res) => {
    try {
        let tmpMessage = ""
        if(req.body.chatGpt && req.body.chatGpt === true) {
            tmpMessage = await chatGpt.askReply(req.body.message)
            if (tmpMessage.Message && tmpMessage.Message === "ChatGPT error") {
                return res.status(200).json(tmpMessage);
            } 
        } else {
            tmpMessage = req.body.message
        }
        const message = new messageModel({
           "user":req.body.user,
           "message":tmpMessage
        })
        await message.save()
        return res.status(200).json({"Message":"Success"});
    } catch(err) {
        return res.status(500).json({"Message":"Internal server error"});
    }
})

module.exports = router