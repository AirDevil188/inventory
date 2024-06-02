const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher", required: true },
  location: { type: String, required: true, maxLength: 100 },
  date_of_foundation: { type: Date },
  date_of_closing: { type: Date },
});

DeveloperSchema.virtual("url").get(function () {
  return `/catalog/developer/${this._id}`;
});

DeveloperSchema.virtual("date_of_foundation_formatted").get(function () {
  return this.date_of_foundation
    ? DateTime.fromJSDate(this.date_of_foundation).toLocaleString(
        DateTime.DATE_MED
      )
    : "";
});

DeveloperSchema.virtual("date_of_foundation_default").get(function () {
  return this.date_of_foundation
    ? DateTime.fromJSDate(this.date_of_foundation).toISODate()
    : "";
});

DeveloperSchema.virtual("date_of_closing_formatted").get(function () {
  return this.date_of_closing
    ? DateTime.fromJSDate(this.date_of_closing).toLocaleString(
        DateTime.DATE_MED
      )
    : "";
});

DeveloperSchema.virtual("date_of_closing_default").get(function () {
  return this.date_of_closing
    ? DateTime.fromJSDate(this.date_of_closing).toISODate()
    : "";
});

module.exports = mongoose.model("Developer", DeveloperSchema);
