/**
 * REALTIME
 */

let UserClass = require("./utilities/UserClass");
let users = new UserClass();
let connectedIndividualUsers = {};
let BOT_ID = "5d90866f6a1756647a6da758";
let BOT_SOCKET = [];

module.exports = (server) => {
    let io = require('socket.io')(server);
    initializeSocket(io)
}
function initializeSocket(io) {
    io.on("connection", (socket) => {
        console.log("a user connected ...");
        socket.on("disconnect", () => {
            let userDisconnect = users.RemoveDisconnectdChanelUser(socket.id);
            console.log("user disconnected", userDisconnect)
            if (userDisconnect) {
                socket.to(userDisconnect.room).emit("list-connected-chanel-users", users.GetConnectedChanelUser(userDisconnect.room));
            }
        })

        /**
         * Comunity Chat
         */
        socket.on("join-chanel", (data, cb) => {
            try {
                let { chanelId, sid, uid, name, photo } = data;

                if(uid === BOT_ID) {
                    BOT_SOCKET[BOT_ID] = socket;
                }

                let listConnectedUids = users.GetUidConnectedChanelUser(chanelId);
                let checkUser = listConnectedUids.indexOf(uid);
                console.log("join", chanelId)
                socket.join(data.chanelId);
                if (checkUser === -1) {
                    users.AddConnectedChanelUser(sid, uid, name, photo, chanelId);
                }
                io.to(chanelId).emit("list-connected-chanel-users", users.GetConnectedChanelUser(chanelId));
                
                if(BOT_SOCKET[BOT_ID]) {
                    BOT_SOCKET[BOT_ID].emit("play-music", {chanelId})
                }

                cb();
            } catch (e) { console.log("!error join-chanel", e) }
        })

        socket.on("client-send-message-from-chanel", (data, cb) => {
            try {
                console.log("client-send-message-from-chanel", data)
                let { chanelId } = data;
                data.sid = socket.id;

                io.to(chanelId).emit("server-send-message-from-chanel", { status: 200, data });
                cb();
            } catch (e) { console.log("!error client-send-message-from-chanel", e) }
        });

        socket.on("client-send-message-contain-image-from-chanel", (data, cb) => {
            try {
                console.log("client-send-message-contain-image-from-chanel", data)
                let { chanelId } = data;
                data.sid = socket.id;

                io.to(chanelId).emit("server-send-message-contain-image-from-chanel", { status: 200, data });
                cb();
            } catch (e) { console.log("!error client-send-message-from-chanel", e) }
        });

        socket.on("skip-music", chanelId => {
            console.log("skip-music", chanelId);
            io.to(chanelId).emit("skip-music");
        })

        socket.on("play-music", data => {
            BOT_SOCKET[BOT_ID].to(data.chanelId).emit("bot-send-queue", data);
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
            console.log("***SEND***", data)
            if (connectedIndividualUsers.hasOwnProperty(to)) {
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
            console.log("***SEND***", data)
            if (connectedIndividualUsers.hasOwnProperty(to)) {
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

        /**
         * Video call
         */

        socket
            .on('request', (data) => {
                const receiver = connectedIndividualUsers[data.to];
                if (receiver) {
                    receiver.emit('request', { from: data.from });
                }
            })
            .on('call', (data) => {
                const receiver = connectedIndividualUsers[data.to]
                if (receiver) {
                    receiver.emit('call', { ...data, from: data.from });
                } else {
                    socket.emit('failed');
                }
            })
            .on('end', (data) => {
                const receiver = connectedIndividualUsers[data.to]
                if (receiver) {
                    receiver.emit('end');
                }
            })

        socket.on("call-video-from-individual-user", (data) => {
            let { to, from } = data;
            if (connectedIndividualUsers.hasOwnProperty(to)) {
                console.log("calling ...")
            }
        })

        socket.on("end-call-video-from-individual-user", (data) => {
            let { to, from } = data;
            if (connectedIndividualUsers.hasOwnProperty(to)) {
                console.log("end call!")
            }
        })
    })
}

/**
 * REALTIME
 */