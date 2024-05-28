const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlatformScheme = new Schema({
  name: { type: String, maxLength: 20, required: true },
});

PlatformScheme.virtual("url").get(function () {
  return `/catalog/platform/${this._id}`;
});

module.exports = mongoose.model("Platform", PlatformScheme);
