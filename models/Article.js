// Import mongoose nmp package into a variable:
const mongoose = require("mongoose");

// Save a reference to the Schema constructor:
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object:
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },
  imageSrc: {
    type: String,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method:
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
