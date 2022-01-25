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
