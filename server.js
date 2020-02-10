
// express
const express = require("express");
const app = express();

// port
const PORT = process.env.PORT || 8080;

// depedencies
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require('dotenv').config()

// database
mongoose.connect(process.env.DB_URI, {useUnifiedTopology: true, useNewUrlParser: true}, () => {
    console.log("Database connecting...");
});
mongoose.connection.on("error", (error) => {
    console.log(`Connect occur error: ${error}`);
});

// Routes
const indexRoute = require("./routes/index");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const tagRoute = require("./routes/tags");
const acmRoute = require("./routes/announcements");
const blogRoute = require("./routes/blogs");
const AskRoute = require("./routes/asks");
const voteRoute = require("./routes/votes");
const reqUpgrade = require("./routes/request-upgrade");
const notifyRoute = require("./routes/notify");
const chanelRoute = require("./routes/chanels");
const pmRoute = require("./routes/private-chat");

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// use routes
app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/tags", tagRoute);
app.use("/announcements", acmRoute);
app.use("/blogs", blogRoute);
app.use("/asks", AskRoute);
app.use("/votes", voteRoute);
app.use("/request", reqUpgrade);
app.use("/notify", notifyRoute);
app.use("/chanels", chanelRoute);
app.use("/pm", pmRoute);


app.use( function(error, req, res, next) {
    if(error.name === "UnauthorizedError") {
        return res.status(403).json( {message: error.message} );
    }
    next();
})

// 404 handling - put it in very bottom because express will exucute all middlewares and functions, so if 404 this middleware will be run
app.use(function (req, res, next) {
    res.status(404).send({error: "404 not found!"});
});

/**
 * REALTIME
 */

let http = require('http').createServer(app);
let io = require('socket.io')(http);
let UserClass = require("./utilities/UserClass");
let users = new UserClass();
let connectedIndividualUsers = {};

io.on("connection", function(socket) {
    console.log("a user connected ...");
    socket.on("disconnect", () => {
        let userDisconnect = users.RemoveDisconnectdChanelUser(socket.id);
        console.log("user disconnected", userDisconnect)
        if(userDisconnect) {
            io.to(userDisconnect.room).emit("list-connected-chanel-users", users.GetConnectedChanelUser(userDisconnect.room));
        }
    })

    /**
     * Comunity Chat
     */
    socket.on("join-chanel", (data, cb) => {
        try {
            let { chanelId, sid, uid, name, photo } = data;
    
            let listConnectedUids = users.GetUidConnectedChanelUser(chanelId);
            let checkUser = listConnectedUids.indexOf(uid);
            console.log("join", chanelId)
            socket.join(data.chanelId);
            if(checkUser === -1) {
                users.AddConnectedChanelUser(sid, uid, name, photo, chanelId);
            }
            io.to(chanelId).emit("list-connected-chanel-users", users.GetConnectedChanelUser(chanelId));
            
            cb();
        } catch (e) { console.log("!error join-chanel", e) }
    })

    socket.on("client-send-message-from-chanel", (data, cb) => {
        try {
            console.log("client-send-message-from-chanel", data)
            let { chanelId } = data;
            data.sid = socket.id;
    
            io.to(chanelId).emit("server-send-message-from-chanel", {status: 200, data});
            cb();
        } catch(e) { console.log("!error client-send-message-from-chanel", e) }
    });

    socket.on("client-send-message-contain-image-from-chanel", (data, cb) => {
        try {
            console.log("client-send-message-contain-image-from-chanel", data)
            let { chanelId } = data;
            data.sid = socket.id;
    
            io.to(chanelId).emit("server-send-message-contain-image-from-chanel", {status: 200, data});
            cb();
        } catch(e) { console.log("!error client-send-message-from-chanel", e) }
    });


    /**
     * Private Chat
     */
    socket.on("join-individual", (data, cb) => {
        socket.username = data.username;
        socket.uid = data.uid;
        connectedIndividualUsers[data.uid] = socket;

        cb();
    });

    socket.on("client-send-message-from-individual-user", (data, cb) => {
        let { to, message, photo, from } = data;
        console.log(data)
        if(connectedIndividualUsers.hasOwnProperty(to)) {
            connectedIndividualUsers[to].emit("server-send-message-from-individual-user", {
                message,                    // message of sender
                username: socket.username,  // username of sender
                to,                         // receiver id
                from,                       // sender id
                photo                       // Photo of sender
            })
        }
        cb();
    });
    socket.on("client-send-message-contain-image-from-individual-user", (data, cb) => {
        let { to, contentPhoto, photo, from } = data;
        console.log(data)
        if(connectedIndividualUsers.hasOwnProperty(to)) {
            connectedIndividualUsers[to].emit("server-send-message-contain-image-from-individual-user", {
                contentPhoto,               // message of sender
                username: socket.username,  // username of sender
                to,                         // receiver id
                from,                       // sender id
                photo                       // Photo of sender
            })
        }
        cb();
    });

});



/**
 * REALTIME
 */


// Listen port
http.listen(PORT, () => {
    console.log(`Liars-ask react listen on port ${PORT}`);
})

