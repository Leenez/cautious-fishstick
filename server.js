const express = require("express");
const mongoose = require("mongoose");
const contactModel = require("./models/contact");

let app = express();
app.use(express.json());
app.use("/",express.static("public"));

let port = process.env.PORT || 3000

const mongo_url = process.env.MONGODB_URL;
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;
const database = "contactdatabase";
const url = `mongodb+srv://${mongo_user}:${mongo_password}@${mongo_url}/${database}?retryWrites=true&w=majority`

mongoose.connect(url).then(
    () => console.log("Connected to MongoDB"),
    (error) => console.log("Failed",error)
)

app.get("/api/contact",function(req,res) {
    contactModel.find().then(function(contacts) {
        return res.status(200).json(contacts)
    }).catch(function(err) {
        return res.status(500).json({"Message":"Internal server error"})
    })
})

app.post("/api/contact", function(req,res) {
    if(!req.body) {
        return res.status(400).json({"Message":"Bad request (body)"})
    }
    if(!req.body.firstname) {
        return res.status(400).json({"Message":"Bad request (first name)"})
    }
    let contact = new contactModel({
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "email":req.body.email,
        "phone":req.body.phone
    })
    contact.save().then(function(contact) {
        return res.status(201).json(contact);
    }).catch(function(err){
        console.log("Database ret err",err);
        return res.status(500).json({"Message":"Internal sever error"})
    })
})

app.delete("/api/contact/:id", function(req,res) {
    contactModel.deleteOne({"_id":req.params.id}).then(function() {
        return res.status(200).json({"message":"success"});
    }).catch(function(err){
        console.log("Database error", err)
        return res.status(500).json({"Message":"Internal sever error"})
    })
})

app.put("/api/contact/:id", function(req,res) {
    if(!req.body) {
        return res.status(400).json({"Message":"Bad request (body)"})
    }
    if(!req.params.id) {
        return res.status(400).json({"Message":"Bad request (id)"})
    }
    let contact = {
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "email":req.body.email,
        "phone":req.body.phone
    }
    contactModel.replaceOne({"_id":req.params.id},contact).then(function() {
        return res.status(200).json({"message":"success"});
    }).catch(function(err){
        console.log("Database error", err)
        return res.status(500).json({"Message":"Internal sever error"})
    })
})

app.listen(port);