const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 }
});

genreSchema.virtual("url").get(function() {
  return "genre/" + this._id;
});

module.exports = mongoose.model("Genre", genreSchema);
