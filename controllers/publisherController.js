const Game = require("../models/game");
const Publisher = require("../models/publisher");
const Developer = require("../models/developer");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.list_publishers = asyncHandler(async (req, res, next) => {
  const allPublishers = await Publisher.find().sort("name");

  res.render("list_publishers", {
    title: "All Publishers",
    publisher_list: allPublishers,
  });
});

exports.publisher_detail = asyncHandler(async (req, res, next) => {
  const [publisher, allGamesByPublisher] = await Promise.all([
    Publisher.findById(req.params.id).exec(),
    Game.find({ publisher: req.params.id }).exec(),
  ]);

  if (publisher === null) {
    const err = new Error("Publisher not found.");
    err.status = 404;
    return next(err);
  }

  res.render("publisher_detail", {
    title: publisher.name,
    publisher: publisher,
    all_games: allGamesByPublisher,
  });
});
