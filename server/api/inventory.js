const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const async = require("async");

app.use(bodyParser.json());

module.exports = app;

const inventoryDB = new Datastore({
    filename: "./server/databases/inventory.db",
    autoload: true
});

app.get("/", function(req, res) {
    console.log("Hello");
    res.send("Inventory API");
});

app.get("product/:productId", function(req, res) {
    if (!req.params.productId) {
        res.status(500).send("ID field is required.");
    } else {
        inventoryDB.findOne({ _id: req.params.productId } , function(err, product) {
            res.send(product);
        });
    }
});

app.get("/products", function(req, res) {
    inventoryDB.find({}, function(err, docs) {
        console.log("sending inventory products");
        res.send(docs);
    });
});

app.post("product/", function(req, res) {
    let newProduct = req.body;

    inventory.DB.insert(newProduct, function(err, product) {
        if (err) {
            res.status(500).send(err);    
        } else {
            res.send(product);
        }
    });
});

app.delete("/product/:productId", function(req, res) {
    inventoryDB.remove({ _id: req.params.productId }, function(err, numRemoved) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

app.put("/product", function(req, res) {
    let productId = req.body._id;

    inventoryDB.update({ _id: productId }, req.body, {}, function(
    err,
    numReplaced,
    product
    ) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});

app.decrementInventory = function(products) {
    async.eachSeries(products, function(transactionProduct, callback) {
        inventoryDB.findOne({ _id: transactionProduct._id }, function(err, product) {
            if (!product || !product.quantity_on_hand) {
                callback();
            } else {
                let updatedQuantity = parseInt(product.quantity_on_hand) -
                    parseInt(transactionProduct.quantity);
                inventoryDB.update(
                    { _id: product._id },
                    { $set: { quantity_on_hand: updatedQuantity } },
                    {},
                    callback
                );
            }
        });
    });
};