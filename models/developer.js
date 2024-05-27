const mongoose = require("mongoose");

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

module.exports = mongoose.model("Developer", DeveloperSchema);
