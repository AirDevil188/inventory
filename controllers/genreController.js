const Game = require("../models/game");
const Genre = require("../models/genre");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const dotenv = require("dotenv");
dotenv.config();

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
  console.log(process.env.MASTER_PASSWORD);
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

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);

  if (genre === null) {
    const err = new Error("Genre was not found.");
    err.status = 404;
    next(err);
  }

  res.render("genre_form", {
    title: "Update Form",
    genre: genre,
  });
});

exports.genre_update_post = [
  body("genre_name", "Genre name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("master_password", "Inccorect password")
    .matches(process.env.MASTER_PASSWORD)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({
      name: req.body.genre_name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Update Form",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedGenre = await Genre.findByIdAndUpdate(
        req.params.id,
        genre,
        {}
      );
      res.redirect(updatedGenre.url);
    }
  }),
];

exports.password_genre_get = asyncHandler(async (req, res, next) => {
  res.render("password_form", {
    title: "Password Login",
  });
  console.log(process.env.MASTER_PASSWORD);
  console.log(req.originalUrl);
});

exports.password_genre_post = asyncHandler(async (req, res, next) => {
  console.log(req.body.master_password);
  console.log(req.originalUrl);

  if (req.body.master_password === process.env.MASTER_PASSWORD) {
    res.render("genre_form", {
      title: "Password Login",
    });
  } else
    res.render("password_form", {
      title: "Password Login",
    });
});
