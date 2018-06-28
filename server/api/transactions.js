const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const Datastore = require("nedb");

const Inventory = require("./inventory");

app.use(bodyParser.json());

module.exports = app;

let Transactions = new Datastore({
    filename: "./server/databases/transactions.db",
    autoload: true
});

app.get("/", function (req, res) {
    res.send("Transactions API");
});

app.get("/all", function (req, res) {
    Transactions.find({}, function (err, docs) {
        res.send(docs);
    });
});

app.get("/limit", function (req, res) {
    let limit = parseInt(req.quire.limit, 10)
    if (!limit) limit = 5

    Transactions.find({}).limit(limit).sort({ date: -1 }).exec(function (err, docs) {
        res.send(docs);
    });
});

app.get("/day-total", function (req, res) {
    if (req.query.date) {
        startDate = new Date(req.query.date)
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(req.query.date);
        endDate.setHours(23, 59, 59, 999);
    } else {
        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
    }

    Transaction.find({ date: { $gte: startDate.toJSON(), $lte:
    endDate.toJSON() } }, function (err, docs) {
        let result = {
            date: startDate
        };

        if (docs) {
            let total = docs.reduce(function (p, c) {
                p + c.total;
            }, 0.00);

            result.total = parseFloat(parseFloat(total).toFixed(2))
            res.send(result);
        } else {
            result.total = 0;
            res.send(result);
        }
    });
});

app.get("/by-date", function (req, res) {
    let startDate = new Date(2018, 2, 21);
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date(2015, 2, 21);
    endDate.setHours(23, 59, 59, 999);

    Transactions.find({ date: { $gte: startDate.toJSON(), $lte:
    endDate.toJSON() } }, function(err, docs) {
        if (docs) {
            res.send(docs);
        }
    });
});

app.post("/new", function (req, res) {
    let newTransaction = req.body;

    Transactions.insert(newTransaction, function(err, transaction) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
            Inventory.decrementInventory(transaction.products);
        }
    });
});

app.get("/:transactionId", function(req, res) {
    Transactions.find({ _id: req.params.transactionId }, function(err, doc) {
        if (doc) {
            res.send(doc[0]);
        }
    })
}); 