const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  publisher: { type: String, required: true },
  developer: { type: String, required: true },
  summary: { type: String, required: true },
  date_of_release: { type: Date },
  esrb_rating: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

GameSchema.virtual("url").get(function () {
  return `/catalog/game/${this._id}`;
});

module.exports = mongoose.model("Game", GameSchema);
