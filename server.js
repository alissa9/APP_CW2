const express = require("express");
const app = express();
app.use(express.json());

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
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});