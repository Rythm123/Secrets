//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// const md=require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;



const app = express();
app.use(express.static("public"))

app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  name: String,
  password: String
});



const User = mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home.ejs");
});

app.get("/login", function(req, res) {
  res.render("login.ejs");
});

app.get("/register", function(req, res) {
  res.render("register.ejs");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if (!err) {
      const newUser = new User({
        name: req.body.username,
        password: hash
      });
      newUser.save(function(err) {
        if (!err) {
          res.render("secrets.ejs");
        } else {
          console.log(err);
        }
      });
    }
  });


});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({
    name: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result == true) {
            res.render("secrets.ejs");
          } else {
            res.redirect("/login")
          }
        });
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started at port 3000");
})
