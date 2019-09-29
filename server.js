
// express
const express = require("express");
const app = express();

// port
const PORT = process.env.PORT || 8080;

//
const mongoose = require("mongoose");
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
const userRoute = require("./routes/users");

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
// use routes
app.use("/", indexRoute);
app.use("/users", userRoute);



app.use( function(error, req, res, next) {
    // handling error
})

// 404 handling - put it in very bottom because express will exucute all middlewares and functions, so if 404 this middleware will be run
app.use(function (req, res, next) {
    res.status(404).send({error: "404 not found!"});
});



// Listen port
app.listen(PORT, () => {
    console.log(`Liars-ask react listen on port ${PORT}`);
})