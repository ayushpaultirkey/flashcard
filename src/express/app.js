const http = require("http");
const path = require("path");
const express = require("express");
const parser = require("body-parser");
const session = require("express-session");
const Serve = require("./../h12/serve");

const app = express();
const server = http.createServer(app);

//
app.use(session({ secret: "app-session", saveUninitialized: true, resave: false, cookie: { maxAge: 6000000 } }));

app.use("/public", Serve(path.join(__dirname, "./../../public")).Express);
app.use("/@h12", express.static(path.join(__dirname, "./../../public/library/h12")));

//
app.use("/@hotreload", function(req, res) {

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let _interval = setInterval(() => { res.write("Connected"); }, 250);

    res.on("close", () => {
        clearInterval(_interval);
        res.end();
    });

});

//
server.listen(process.env.PORT || 3000, () => {
    console.log("http://localhost:3000/login");
});