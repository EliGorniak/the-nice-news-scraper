var express = require("express");
const Articles = require("../models/Article");
var router = express.Router();

// Import the model (cat.js) to use its database functions.

// var news = require("../models/cat.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  res.render("index");
});

router.get("/articles", function(req, res) {
  Articles.find({}).then(function(articles) {
    res.send(articles);
  });
});

// Export routes for server.js to use.
module.exports = router;
