const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlatformSchema = new Schema({
  name: { type: String, maxLength: 20, required: true },
});

PlatformSchema.virtual("url").get(function () {
  return `/catalog/platform/${this._id}`;
});

module.exports = mongoose.model("Platform", PlatformSchema);
