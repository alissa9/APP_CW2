const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const MongoClient = require("mongodb").MongoClient;

//Connect to MongoDB
let db;
MongoClient.connect(
  "mongodb+srv://Alissa:Admin@cluster0.3wemd.mongodb.net/webstore?retryWrites=true&w=majority",
  (err, client) => {
    db = client.db("webstore");
  }
);

//Get the MongoDB collection name
app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  return next();
});

//Root path response
app.get("/", (req, res, next) => {
  res.send("Welcome to MongoDB express server.js");
});

//Retrieve collection with the Get
app.get("/collection/:collectionName", (req, res, next) => {
  console.log("results");
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});

// adding objects to mongodb collection
app.post("/collection/:collectionName", (req, res, next) => {
  // console.log(req.body);
  req.collection.insertOne(req.body, (e, results) => {
    if (e) return next(e);
    res.send(results.ops);
  });
});

// request a specific object using mongodb id
const ObjectID = require("mongodb").ObjectID;
app.get("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e);
    res.send(result);
  });
});

// update object in mongodb
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

// delete an object from mongodb
app.delete("/collectione/:collectionName/:id", (req, res, next) => {
  req.collection.deleteOne({ _id: ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e);
    res.send(result.result.n === 1 ? { msg: "success" } : { msg: "error" });
  });
});

const port = process.env.PORT || 3000;
app.listen(port);
