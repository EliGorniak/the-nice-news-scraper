// Import mongoose nmp package into a variable:
const mongoose = require("mongoose");

// Save a reference to the Schema constructor:
const Schema = mongoose.Schema;

// Using the Schema constructor to create a new CommentSchema object:
const CommentSchema = new Schema({
  body: String
});

// This creates our model from the above schema, using mongoose's model method:
const Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model:
module.exports = Comment;
