const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  name: { type: String, require: true, maxLength: 100 },
  location: { type: String, require: true, maxLength: 100 },
  date_of_foundation: { type: Date },
  date_of_closing: { type: Date },
});

PublisherSchema.virtual("url").get(function () {
  return `/catalog/publisher/${this._id}`;
});

module.exports = mongoose.model("Publisher", PublisherSchema);
