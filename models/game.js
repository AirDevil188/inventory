const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher", required: true },
  developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
  summary: { type: String, required: true },
  date_of_release: { type: Date },
  esrb_rating: { type: String, required: true },
  platform: [{ type: Schema.Types.ObjectId, ref: "Platform" }],
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

GameSchema.virtual("url").get(function () {
  return `/catalog/game/${this._id}`;
});

GameSchema.virtual("date_of_release_formatted").get(function () {
  return this.date_of_release
    ? DateTime.fromJSDate(this.date_of_release).toLocaleString(
        DateTime.DATE_MED
      )
    : "";
});

GameSchema.virtual("date_of_release_default").get(function () {
  return this.date_of_release
    ? DateTime.fromJSDate(this.date_of_release).toISODate()
    : "";
});

module.exports = mongoose.model("Game", GameSchema);
