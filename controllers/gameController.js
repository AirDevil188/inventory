const Game = require("../models/game");
const Publisher = require("../models/publisher");
const Developer = require("../models/developer");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [numGames, numPublishers, numDevelopers, numGenres, numGameInstances] =
    await Promise.all([
      Game.countDocuments().exec(),
      Publisher.countDocuments().exec(),
      Developer.countDocuments().exec(),
      Genre.countDocuments().exec(),
      GameInstance.countDocuments().exec(),
    ]);

  res.render("index", {
    title: "Games Library",
    num_games: numGames,
    num_publishers: numPublishers,
    num_developers: numDevelopers,
    num_genres: numGenres,
    num_gameinstances: numGameInstances,
  });
});
