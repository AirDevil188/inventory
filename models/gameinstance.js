const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
  platform: { type: String, required: true },
  status: {
    type: String,
    enum: ["Maintenance", "Available", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

GameInstanceSchema.virtual("url").get(function () {
  return `/catalog/gameinstance/${this._id}`;
});

GameInstanceSchema.virtual("due_back_formatted").get(function () {
  return this.due_back
    ? DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
    : "";
});

GameInstanceSchema.virtual("due_back_default").get(function () {
  return this.due_back ? DateTime.fromJSDate(this.due_back).toISODate() : "";
});
module.exports = mongoose.model("GameInstance", GameInstanceSchema);
