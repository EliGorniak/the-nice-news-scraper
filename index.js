// Importing the npm packages as dependencies:
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Scraping tools:
const cheerio = require("cheerio");
const axios = require("axios");

// Set Handlebars:
const exphbs = require("express-handlebars");

// Connection by port:
const PORT = process.env.PORT || 8080;

// Initializing Express:
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Serve static content for the app from the "public" directory in the application directory:
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define engine handlebars:
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB:
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connected!"))
  .catch(err => {
    console.log("DB Connection Error:", err.message);
  });

// Import routes and give the server access to them.
const routes = require("./controllers/newscontroller.js");
app.use(routes);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
