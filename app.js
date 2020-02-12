/*
 * app.js
 * Copyright (C) 2020 sandeep <sandeep@sandeep-pc>
 *
 * Distributed under terms of the MIT license.
 */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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
//   title: "Mangoes",
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

//API(s)

// console.log(NotesModel.find());

server.get("/notes", (req, res) => {
  NotesModel.find((err, data) => {
    // console.log(data);
    res.json(data);
  });
});

server.post("/savenote", (req, res) => {
	console.log("-----------------------------------");
  console.log(req.body);
});

server.get("/note/:id", (req, res) => {
  // console.log(`REQ for ID ${req.params.id}`);
  NotesModel.find({ _id: req.params.id }, (err, data) => {
    if (err) console.log(err);
    // console.log(data);
    res.json(data);
  });
});

server.get("/", (req, res) => res.send("test2"));

//SERVER LISTEN
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
