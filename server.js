const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
var path = require("path");
var fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const MongoClient = require("mongodb").MongoClient;

// logger middleware

app.use(function (req, res, next) {
  console.log("Incoming requrst for"+ req.url);
  console.log(res.statusCode)
  console.log(req.method)

  next();
});


//Connect client to mongo db
let db;
MongoClient.connect(
  "mongodb+srv://Alissa:Admin@cluster0.3wemd.mongodb.net/webstore?retryWrites=true&w=majority",
  (err, client) => {
    db = client.db("webstore");
  }
);

//Get the mongoDB collection names
app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  if (collectionName === "lessons" || collectionName == "orders") {
    req.collection = db.collection(collectionName);
    return next();
  } 
  else {
    res.status(500).send({ message: "Invalid collection" })
  }
});

//Root path response
app.get("/", (req, res, next) => {
  res.send("Welcome to MongoDB express server.js");
});

// get lesson from mongodb
app.get("/collection/:collectionName", (req, res, next) => {
  console.log("results");
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});

// adding orders to mongodb
app.post("/collection/:collectionName", (req, res, next) => {
  // console.log(req.body);
  req.collection.insertOne(req.body, (e, results) => {
    if (e) return next(e);
    res.send(results.ops);
  });
});

// request a specific object using mongodb id
const ObjectID = require("mongodb").ObjectID;
const { restart } = require("nodemon");
app.get("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e);
    res.send(result);
  });
});

// update lessons in mongodb
app.put("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.updateOne(
    { _id: new ObjectID(req.params.id) },
    { $set: { spaces: req.body.spaces } },
    { safe: true, multi: false },
    (e, result) => {
      if (e) throw e;
      res.status(200).send({ message: "updated lessons spaces" });
    }
  );
});

// delete an object from mongodb
app.delete("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.deleteOne(
    { _id: new ObjectID(req.params.id) },
    (e, result) => {
      if (e) throw e;
      res.status(200).send({ message: "deleted lesson" });
    }
  );
});


// static file middleware
app.use(function (req, res, next) {
  // Uses path.join to find the path where the file should be
  var filePath = path.join(__dirname, "images", req.url);

  // Built-in fs.stat gets info about a file
  fs.stat(filePath, function (err, fileInfo) {
    if (err) {
      next();
      return;
    }
    if (fileInfo.isFile()) res.sendFile(filePath);
    else next();
  });
});

// no 'next' argument because this is the last middleware.
app.use(function (req, res) {
  res.status(404);
  res.send("File not found!");
});

app.listen(port = process.env.PORT || 3000, () => { 
  console.log(`Server running on ${process.env.PORT || 3000}`);
});

