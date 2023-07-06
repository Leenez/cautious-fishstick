const express = require("express");
const chatRoute = require("./routes/chatroute");
const accountsRoute = require("./routes/accountsroute");
const config = require("../config");
const middleWare = require("./middleware/userloggedin");
const dbAccess = require("./middleware/dbaccess");

const startServer = async () => {
    await dbAccess.openMongooseConnection();

    let app = express();
    app.use(express.json());
    app.use("/",express.static("public"))
    
    let port = process.env.PORT || 3001 
    
    app.use("",accountsRoute);
    app.use("/api",middleWare.isUserLogged,chatRoute);

    app.listen(port);
    console.log("Running in port",port);
}

startServer();