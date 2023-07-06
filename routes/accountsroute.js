const express = require("express")
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const userLastSeenModel = require("../models/userlastseen");
const sessionModel = require("../models/session");
const serverConfig = require("../../config");
const middleWare = require("../middleware/userloggedin")

let router = express.Router()

router.post("/register", function(req,res) {
    if(!req.body) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    if(req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    bcrypt.hash(req.body.password,14, (err,hash) => {
        if(err) {
            return res.status(500).json({"Message":"Internal server error"});
        }
        let user = new userModel({
            "username":req.body.username,
            "password":hash
        })
        user.save().then((user) => {
            const currentDate = Date.now(); 
            let lastSeen = new userLastSeenModel({
               "user":req.body.username,
               "lastseen":currentDate
            })
            lastSeen.save()
            return res.status(200).json({"Message":"Register success"});
        }).catch(function(err) {
            if(err.code === 11000) {
                return res.status(409).json({"Message":"Username is already in use"})
            }
            console.log(err);
            return res.status(500).json({"Message":"internal Server error"})
        })
    })
})

router.post("/login", (req,res) => {
    if(!req.body) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    if(req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({"Message":"Bad Request"});
    }
    userModel.findOne({"username":req.body.username}).then(function(user) {
        if(!user) {
            return res.status(401).json({"Message":"Unauthorized"});
        }
        bcrypt.compare(req.body.password,user.password,function(err,success) {
            if(err) {
                console.log(err);
                return res.status(500).json({"Message":"Iternal Server Error"})
            }
            if(!success) {
                return res.status(401).json({"Message":"Unauthorized"});
            }
            let token = middleWare.createToken();
            let now = Date.now();
            let session = new sessionModel({
                "user":req.body.username,
                "ttl":now+serverConfig.time_to_live_diff,
                "token":token
            })
            session.save().then(function(session){
                return res.status(200).json({"token":token})
            }).catch(function(err){
                return res.status(500).json({"Message":"Internal Sever Error"})
            })
        })
        }).catch(function(err) {
            console.log(err)
            return res.status(500).json({"Message":"Internal Server Error"})
        })
})

router.post("/logout", (req,res) => {
    if(!req.headers.token) {
        return res.status(404).json({"Message":"Not found"});
    }
    sessionModel.deleteOne({"token":req.headers.token}).then(function() {
        return res.status(200).json({"Message":"Logged out"})
    }).catch(function(err) {
        console.log(err);
        return res.status(500).json({"Message":"Internal Server Error"});
    });
});

module.exports = router