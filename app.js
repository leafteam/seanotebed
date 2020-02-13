/*
 * app.js
 * Copyright (C) 2020 sandeep <sandeep@sandeep-pc>
 *
 * Distributed under terms of the MIT license.
 */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//MONGO

mongoose.connect("mongodb://localhost:27017/newdb", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;

//USERS

const UserSchema = new mongoose.Schema({
  id: Number,
  email: String,
  password: String
});

const UserModel = mongoose.model("users", UserSchema);

let ram = new UserModel({ id: 21, email: "ram@test.com", password: "test" });

// ram.save((err,data)=>{
// 	if(err) console.log(err);
// 	console.log(data)
// })

// NOTES

const NotesSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  content: String
});

const NotesModel = new mongoose.model("notesnew", NotesSchema);

// const note1 = new NotesModel({
//   title: "Peaches",
//   subtitle: "It's a fruit",
//   content: "It's yellow and tasty and supposedly king of fruits"
// });
// note1.save((err,data)=>{
// 	if(err) console.log(err);
// 	console.log(data);
// })

//SERVER

const PORT = 8072;

const server = express();
server.use(cors());
server.use(bodyParser.json()); // to support JSON-encoded bodies
server.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
server.use(express.json());

//API(s)

// console.log(NotesModel.find());

server.get("/notes", (req, res) => {
  // console.log("notes was called");
  NotesModel.find((err, data) => {
    // console.log(data);
    res.json(data);
  });
});

server.post("/savenote", (req, res) => {
  // console.log(req.body);
  if (req.body.id) {
    NotesModel.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { upsert: true },
      (err, data) => {
        if (err) console.log(err);
        // console.log("ret data------------");
        // console.log(data);
        res.send({ id: `${data._id}` });
      }
    );
  } else {
    new NotesModel({
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content
    }).save((err, data) => {
      if (err) console.log(err);
      // console.log(data);
    });
  }
});

server.get("/note/:id", (req, res) => {
  // console.log(`REQ for ID ${req.params.id}`);
  NotesModel.find({ _id: req.params.id }, (err, data) => {
    if (err) console.log(err);
    // console.log(data);
    res.json(data);
  });
});

server.delete("/deletenote/:id", (req, res) => {
  // console.log(req.params.id);
  NotesModel.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) console.log(err);
    // console.log(data);
    res.send({ message: "sucessfully deleted" });
  });
});

server.get("/", (req, res) => res.send("test2"));

//SERVER LISTEN
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
