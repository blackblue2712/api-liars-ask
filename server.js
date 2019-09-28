
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

// database
console.log(process.env.DB_URI)
mongoose.connect("mongodb://localhost:27017/liars-ask", {useUnifiedTopology: true, useNewUrlParser: true}, () => {
    console.log("Database connecting...");
});
mongoose.connection.on("error", (error) => {
    console.log(`Connect occur error: ${error}`);
});



// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

// routes


// test
app.get("/", (req, res) => {
    res.send("Hello world");
})


// Listen port
app.listen(PORT, () => {
    console.log(`Liars-ask react listen on port ${PORT}`);
})
