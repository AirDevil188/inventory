const Game = require("../models/game");
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
  const [genre, genreGames] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }).exec(),
  ]);

  if (genre === null) {
    const err = new Error("No genre was found.");
    err.status = 404;
    return next(err);
  }
  res.render("genre_detail", {
    title: "Genre",
    genre: genre,
    all_games: genreGames,
  });
});
