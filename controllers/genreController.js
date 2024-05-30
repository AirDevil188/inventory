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

exports.genre_form_get = asyncHandler(async (req, res, next) => {
  res.render("genre_form", {
    title: "Create Genre",
  });
});

exports.genre_form_post = [
  body("game_genre", "Genre must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.game_genre,
    });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        errors: errors.array(),
      });
    } else {
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, allGamesGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }).sort({ title: 1 }).exec(),
  ]);

  if (allGamesGenre === null) {
    const err = new Error("Games were not found.");
    err.status = 404;
    return next(err);
  }

  res.render("genre_delete", {
    title: "Delete Genre",
    genre: genre,
    list_games: allGamesGenre,
  });
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, allGamesGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }).sort({ title: 1 }).exec(),
  ]);

  if (allGamesGenre.length > 0) {
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: genre,
      list_games: allGamesGenre,
    });
    return;
  } else {
    await Genre.findByIdAndDelete(req.body.genre_id);
    res.redirect("/catalog/genres");
  }
});
