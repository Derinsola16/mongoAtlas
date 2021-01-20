// load Express.js
const express = require("express");
const app = express();
// parse the request parameters
app.use(express.json());
// connect to MongoDB
const MongoClient = require("mongodb").MongoClient;
let db;
MongoClient.connect("mongodb+srv://Aderinsolaodusanya:Aderinsola2020@cluster0.qu1dn.mongodb.net/webstore?retryWrites=true&w=majority", (err, client) => {
  db = client.db("webstore");
});
// get the collection name
app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  // console.log('collection name:', req.collection)
  return next();
});

// dispaly a message for root path to show that API is working
app.get("/", function (req, res) {
  res.send("Select a collection, e.g., /collection/messages");
});
// retrieve all the objects from an collection
app.get("/collection/:collectionName", (req, res) => {
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});


//retrive an object by mongoDB ID
const objectID = require('mongodb').objectID

app.get('/collection/:collectionName/:id', (req, res, next) => {
  req.collection.findOne({_id: new objectID(req.params.id) }, (err, result) => {
    if(err) return next(err)
    res.send(result)
  })
})


//add an object
app.post('/collection/:collectionName', (req, res, next) => {
  req.collection.insert(req.body, (err, results) => {
    if(err) return next(err)
    res.send(results.ops)
  })
})


// update an object by ID
app.put("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.update(
    { _id: new ObjectID(req.params.id) },
    { $set: req.body },
    { safe: true, multi: false },
    (e, result) => {
      if (e) return next(e);
      res.send(result.result.n === 1 ? { msg: "success" } : { msg: "error" });
    }
  );
});

// delete an object by ID
app.delete("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.deleteOne({ _id: ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e);
    res.send(result.result.n === 1 ? { msg: "success" } : { msg: "error" });
  });
});

const port = process.env.PORT || 3000

app.listen(port);
console.log("Running on 3k" & port)
