const express = require("express");
const Articles = require("../models/Article");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

var db = require("../models");
// ===== Route for scraping =====

// First, a GET route for scraping:
router.get("/scrape", function(req, res) {
  // Make a request via axios to grab the HTML body from The Washingtonpost Website:
  axios.get("https://www.washingtonpost.com/").then(function(response) {
    // Load the result into cheerio and save it to $ for a shorthand selector:
    var $ = cheerio.load(response.data);
    console.log(response.data);

    // Variable to save the data that will be scrape:
    var new_article = {
      title: title,
      summary: summary,
      link: link,
      image: image
    };

    // Add the text and href of every h2 tag, and save them as properties of the result object:
    $(".headline").each(function(i, element) {
      var title = $(element)
        .find("div.row")
        .find("div.headline")
        .find("a")
        .text();
      var link = $(element)
        .find("div.row")
        .find("div.headline")
        .find("a")
        .attr("href");
      var summary = $(element)
        .find("div.row")
        .find("div.blurb")
        .text();
      var image = $(element)
        .find("div.row")
        .find("div.photo-wrapper")
        .find("a")
        .find("img")
        .find("src");

      // Create a new Article using the `new_article` object built from scraping:
      db.Article.create(new_article)
        .then(function(dbArticle) {
          // View the added result in the console:
          console.log(dbArticle);
        })
        // If an error occurred, log it:
        .catch(function(err) {
          console.log(err);
        });
    });
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for homepage:
router.get("/", function(req, res) {
  db.Article.find({})
    .then(function(result) {
      // If we were able to successfully find Articles, send them back to the client:
      res.render("index", result);
    })
    // If an error occurred, send it to the client:
    .catch(function(err) {
      res.json(err);
    });
});

// Route for the page with the favorite articles choosen by client:
router.get("/favorites", function(req, res) {
  db.Article.find({})
    .then(function(result) {
      // If we were able to successfully find the favorite Articles, send them back to the client:
      res.render("index", result);
    })
    // If an error occurred, send it to the client:
    .catch(function(err) {
      res.json(err);
    });
});

// Route for getting all Articles from the db:
router.get("/articles", function(req, res) {
  // Grab every document in the Articles collection:
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client:
      res.json(dbArticle);
    })
    // If an error occurred, send it to the client:
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's comment:
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db:
  db.Article.findOne({ _id: req.params.id })
    // and populate all of the notes associated with it:
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client:
      res.json(dbArticle);
    })
    // If an error occurred, send it to the client:
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated comment:
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry:
  db.Comment.create(req.body)
    .then(function(dbCommnet) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note;
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default;
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query:
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbCommnet._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client:
      res.json(dbArticle);
    })
    // If an error occurred, send it to the client:
    .catch(function(err) {
      res.json(err);
    });
});

// Route for add an Article's associated comment:
router.put("/articles/favorites/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry:
  db.Article.findOne({ _id: req.params.id })
    .then(function(result) {
      if (result.isFavorite) {
        db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { isFavorite: false } }
        )
          // If we were able to successfully update an favorite Article, send it back to the client:
          .then(function(result) {
            res.json(result);
          })
          .catch(function(err) {
            res.json(err);
          });
      } else {
        db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { isFavorite: true } }
        )
          // If we were able to successfully update an favorite Article, send it back to the client:
          .then(function(result) {
            res.json(result);
          })
          // If an error occurred, send it to the client:
          .catch(function(err) {
            res.json(err);
          });
      }
    })
    // If an error occurred, send it to the client:
    .catch(function(err) {
      res.json(err);
    });
});

router.delete("/articles/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Article.update({ _id: req.params.id }, { $unset: { comment: 1 } })
    .then(function(result) {
      // If we were able to successfully delete a comment, send it back to the client
      res.json(req.params.id);
    })
    // If an error occurred, send it to the client:
    .catch(function(err) {
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
