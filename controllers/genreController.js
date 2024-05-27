const Game = require("../models/game");
const Developer = require("../models/developer");
const Publisher = require("../models/publisher");
const GameInstance = require("../models/gameinstance");
const Genre = require("../models/genre");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.list_genres = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort("name").exec();
  console.log(allGenres);

  res.render("list_genres", {
    title: "All Genres",
    genre_list: allGenres,
  });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genreDetails, genreGames] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }).exec(),
  ]);

  console.log(genreGames);

  res.render("genre_detail", {
    title: "Genre",
    genre: genreDetails,
    all_games: genreGames,
  });
});
