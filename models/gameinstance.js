const mongoose = require("mongoose");

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

module.exports = mongoose.model("GameInstance", GameInstanceSchema);
