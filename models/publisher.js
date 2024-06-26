const { DateTime } = require("luxon");
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

PublisherSchema.virtual("date_of_foundation_formatted").get(function () {
  return this.date_of_foundation
    ? DateTime.fromJSDate(this.date_of_foundation).toLocaleString(
        DateTime.DATE_MED
      )
    : "";
});

PublisherSchema.virtual("date_of_foundation_default").get(function () {
  return this.date_of_foundation
    ? DateTime.fromJSDate(this.date_of_foundation).toISODate()
    : "";
});

PublisherSchema.virtual("date_of_closing_formatted").get(function () {
  return this.date_of_foundation
    ? DateTime.fromJSDate(this.date_of_foundation).toLocaleString(
        DateTime.DATE_MED
      )
    : "";
});

PublisherSchema.virtual("date_of_closing_default").get(function () {
  return this.date_of_foundation
    ? DateTime.fromJSDate(this.date_of_foundation).toISODate()
    : "";
});
module.exports = mongoose.model("Publisher", PublisherSchema);
