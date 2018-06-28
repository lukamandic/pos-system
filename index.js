const express = require("express"),
    http = require("http"),
    port = 3000,
    app = require("express")(),
    server = http.createServer(app),
    bodyParser = require("body-parser"),
    io = require("socket.io")(server);
let liveCart;

console.log("Real time POS running");
console.log("Server started");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 
    "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type, Accept, X-Access-Token, X-Key");
    if (req.method == "OPTIONS") {
        res.status(200).end();
    } else {
        next();
    }
});

app.get("/", function(req, res) {
    res.send("Real time POS web app running.");
});

app.use("/api/inventory", require("./server/api/inventory"));
app.use("/api", require("./server/api/transactions"));

io.on("connection", function(socket) {
    socket.on("cart-transaction-complete", function() {
        socket.broadcast.emit("update-live-cart-display", {})
    });
    socket.on("live-cart-page-loaded", function() {
        socket.emit("update-live-cart-display", liveCart)
    })
    socket.emit("update-live-cart-display", liveCart);
    socket.on("update-live-cart", function(cartData) {
        liveCart = cartData;
        socket.broadcast.emit("update-live-cart-display", liveCart);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));